import { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { Buffer } from "buffer";
import idl from "./idl.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider, web3, utils } from "@project-serum/anchor";

// Destructuring web3 objects
const { SystemProgram, Keypair } = web3;

// Set Buffer globally
window.Buffer = Buffer;

// Initialize program ID
const programID = new PublicKey(idl.metadata.address);

// Define network configuration
const network = clusterApiUrl("devnet");

// Options for establishing connection
const opts = {
  preflightCommitment: "processed",
};

// Generate a base account keypair
const baseAccount = Keypair.generate();
console.log("baseAccount publicKey :", baseAccount.publicKey.toString());

// Initialize connection to Solana blockchain
const connection = new Connection(network, opts.preflightCommitment);

const App = () => {
  const [data, setData] = useState([]);
  const [img, setImg] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [walletaddress, setWalletAddress] = useState("");

  // Function to get Anchor provider
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  // Function to check if a wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          // const response = await solana.connect({
          //   onlyIfTrusted: true,
          // });
          const response = await solana.connect();
          console.log(response.publicKey);
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found!, Get a Phantom Wallet");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to shorten a given address by replacing characters in the middle with ellipsis.
  function shortenAddress(address, startLength = 5, endLength = 3) {
    if (!address) return "";
    const maxLength = startLength + endLength + 3;
    if (address.length <= maxLength) return address;
    const start = address.substring(0, startLength);
    const end = address.substring(address.length - endLength);
    return `${start}...${end}`;
  }

  // Function to submit an image to Cloudinary for upload.
  const submitImage = async (event) => {
    try {
      event.preventDefault();
      const data = new FormData();
      console.log(img);
      data.append("file", img);
      data.append("upload_preset", "event_nft");
      data.append("cloud_name", "darrqmepw");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/darrqmepw/image/upload",
        {
          method: "post",
          body: data,
        }
      );

      const imageData = await response.json();
      console.log(imageData);
      console.log(imageData.secure_url);
      setImg(imageData.secure_url);

      return imageData.secure_url;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Function to create a post by connecting to the smart contract via RPC and lib.json.
  const createPostFunction = async (event) => {
    event.preventDefault();
    try {
      // Get the provider to connect to the Solana network
      const provider = getProvider();

      // Initialize the program with the IDL and program ID
      const program = new Program(idl, programID, provider);

      // Submit the image and get the URL
      const imageUrl = await submitImage(event);

      // Check if all required data is present
      if (
        imageUrl !== "" &&
        title !== "" &&
        description !== "" &&
        walletaddress !== ""
      ) {
        // If all data is present, create the post
        const tx = await program.rpc.createPost(
          imageUrl,
          title,
          description,
          walletaddress,
          {
            accounts: {
              feedPostApp: baseAccount.publicKey,
              user: provider.wallet.publicKey,
              systemProgram: SystemProgram.programId,
            },
            signers: [baseAccount],
          }
        );
      } else {
        // If any data is missing, log an error message
        console.log("Enter All Data");
      }

      // Perform additional actions after creating the post (e.g., onLoad())
      onLoad();
    } catch (err) {
      // Log any errors that occur during post creation
      console.log(err.message);
    }
  };

  // Function to retrieve posts from the smart contract.
  const getPosts = async () => {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    try {
      await Promise.all(
        (
          await connection.getProgramAccounts(programID)
        ).map(
          async (
            tx,
            index //no need to write smartcontract to get the data, just pulling all transaction respective programID and showing to user
          ) => ({
            ...(await program.account.feedPostApp.fetch(tx.pubkey)),
            pubkey: tx.pubkey.toString(),
          })
        )
      ).then((result) => {
        console.log(result);
        setData(result);
        console.log("Get post", result);
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  // Hook to check if wallet is connected on component mount
  useEffect(() => {
    try {
      onLoad();
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  const onLoad = async () => {
    await checkIfWalletIsConnected();
    await getPosts();
  };

  return (
    <>
      <header class="text-gray-400 bg-gray-900 body-font">
        <div
          class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row space-between"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span class="ml-3 text-xl text-white">BlogDapp</span>
          <button
            class={`text-white ${walletaddress == "" ? "bg-blue-700" : "bg-gray-500"} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
            onClick={onLoad}
          >
            {walletaddress == "" ? "Connect" : shortenAddress(walletaddress)}
          </button>
        </div>
      </header>
      <section
        class="text-gray-400 bg-gray-900 body-font"
        style={{
          width: "100vw",
          minHeight: "100vh",
          width: "-webkit-fill-available",
        }}
      >
        <form class="max-w-sm mx-auto">
          <div class="mb-5">
            <label
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              for="user_avatar"
            >
              Upload file
            </label>
            <input
              class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="user_avatar_help"
              id="user_avatar"
              type="file"
              onChange={(e) => setImg(e.target.files[0])}
            ></input>
          </div>
          <div class="mb-5">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Title
            </label>
            <input
              type="email"
              id="email"
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Enter title..."
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              required
            />
          </div>
          <div class="mb-5">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <input
              type="email"
              id="email"
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Enter description..."
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              required
            />
          </div>
          <button
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={createPostFunction}
          >
            Create Blog
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            paddingTop: "20px",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {data !== "" &&
            data.map((data) => {
              console.log(data);
              return (
                <>
                  <div
                    class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                    style={{ marginBottom: "25px" }}
                  >
                    <a href="#">
                      <img class="rounded-t-lg" src={data.img} alt="" />
                    </a>
                    <div class="p-5">
                      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {data.title}
                      </h5>
                      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                        {data.desc}
                      </p>
                      <p class="font-normal text-gray-700 dark:text-gray-400">
                        By: {shortenAddress(data.address, 6, 6)}
                      </p>
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      </section>
    </>
  );
};

export default App;
