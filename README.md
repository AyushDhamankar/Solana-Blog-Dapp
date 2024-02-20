## Simple Solana Blog DApp

This repository contains a simple Solana Decentralized Application (DApp) for writing and fetching blog posts on the Solana blockchain. Users can create blog posts by uploading images, providing a title, and writing a description. Additionally, they can view all existing blog posts on the blockchain.

### Features

- **Create Blog Posts**: Users can create blog posts by uploading images, providing titles, and writing descriptions.
- **View Blog Posts**: All existing blog posts are displayed on the DApp, allowing users to read and explore them.
- **Connect Wallet**: Users can connect their Phantom wallets to interact with the DApp.

### Technologies Used

- **React**: The frontend of the DApp is built using React, a popular JavaScript library for building user interfaces.
- **@project-serum/anchor**: This library facilitates communication with the Solana blockchain, enabling interaction with smart contracts.
- **@solana/web3.js**: The official Solana JavaScript library is used to interact with the Solana blockchain.
- **Cloudinary**: Images uploaded by users are stored and served using Cloudinary, a cloud-based image and video management service.

### Installation

To run the Solana Blog DApp locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/AyushDhamankar/Solana-Blog-Dapp.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Solana-Blog-Dapp
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Access the DApp in your browser at `http://localhost:3000`.

### Usage

1. Connect your Phantom wallet by clicking the "Connect" button.
2. Create a new blog post by uploading an image, providing a title, and writing a description. Click "Create Blog" to submit the post.
3. View existing blog posts displayed on the DApp.
4. Explore and enjoy reading blog posts written by other users.

### Deployment

The Solana Blog DApp is deployed and accessible at the following link:

[Solana Blog DApp](https://solana-blogdapp.netlify.app/)

### Note

- This is a simple implementation of a Solana Blog DApp for educational purposes. Additional features and enhancements can be implemented for a more robust application.

### License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to fork and modify the project for your own purposes. Contributions are welcome!
