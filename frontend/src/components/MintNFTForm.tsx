import { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { uploadFileToIPFS, uploadJSONToIPFS } from '../utils/pinata';
import { ethers, Signer } from 'ethers';
import NFTCollection from '../contracts/NFTCollection.json';
import NFTCollectionContractAddress from '../contracts/contract-address.json'


type FormData = {
  name: string;
  description: string;
  image: File
}

type UploadMessage = {
  type: "success" | "error" | "info",
  message: string
}

type Props = {
  signer: Signer; //Use Contract instead
  canMint: boolean;
  setUserNFTId: Function;
}

const MintNFTForm = ({ signer, canMint, setUserNFTId }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    image: {} as File,
  });

  const [uploadMessage, setUploadMessage] = useState<UploadMessage>();
  const [canClickMint, setCanClickMint] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setUploadMessage({ type: "info", message: "" })
    const { name, description, image } = formData
    if (name !== '' && description !== '' && image?.name) {
      setCanClickMint(true)
    } else {
      setCanClickMint(false)
    }
  }, [formData])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const uploadPictureToIPFS = async (image: File) => {
    try {
      const response = await uploadFileToIPFS(image)
      if (response.success) {
        console.log("Uploaded image to Pinata: ", response.pinataURL)
        return response.pinataURL;
      }
    } catch (e) {
      console.log("Error while uploading picture to IPFS: ", e)
      throw new Error("Error while uploading picture to IPFS")
    }
  }

  const uploadMetadataToIPFS = async (pictureURL: string | undefined) => {
    const { name, description } = formData;
    //Make sure that none of the fields are empty
    if (name === '' || description === '' || pictureURL === undefined) {
      throw new Error("Invalid parameters")
    }
    const nftJSON = {
      name, description, image: pictureURL
    }

    console.log('NFT JSON: ', nftJSON)
    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response)
        return response.pinataURL;
      }
    }
    catch (e) {
      console.log("error uploading JSON metadata:", e)
    }
  }

  const mintNFT = async (pictureURL: string | undefined) => {
    const metadataURL = await uploadMetadataToIPFS(pictureURL);

    //Pull the deployed contract instance
    let contract = new ethers.Contract(NFTCollectionContractAddress.NFTCollection, NFTCollection.abi, signer)

    //actually create the NFT
    let transaction = await contract.mintNFT(metadataURL)
    let transactionResponse = await transaction.wait()
    let newToken = (await contract.getMyNFT()).toNumber()
    alert("NFT minting successful.\nTransaction: " + transactionResponse.transactionHash)
    return newToken;
  }

  const handleSubmit = async () => {
    setCanClickMint(false)
    setIsLoading(true)
    setUploadMessage({ type: "info", message: "Uploading file to IPFS ..." })
    let pictureURL;
    try {
      pictureURL = await uploadPictureToIPFS(formData.image)
    } catch (e) {
      setUploadMessage({ type: "error", message: "Failed to upload file to IPFS" })
      setIsLoading(false)
      return
    }
    try {
      setUploadMessage({ type: "info", message: "Minting NFT ..." })
      const tokenId = await mintNFT(pictureURL)
      setUploadMessage({ type: "success", message: "Minting of NFT is successful" })
      setUserNFTId(tokenId)
      setIsLoading(false)
    } catch (e) {
      console.log("Error while minting NFT: ", e)
      setIsLoading(false)
      setUploadMessage({ type: "error", message: "Failed to mint NFT" })
      return
    }
  };

  return (
    <div>
      <h3>You don't onw any NFT of this collection</h3>
      <h4>Please, feel free to mint:</h4>
      {canMint
        ? <Box
          sx={{
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: "auto",
            marginTop: "10px"
          }}
        >
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            margin="normal"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <TextField
            name="description"
            label="Description"
            variant="outlined"
            margin="normal"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 1,
              minWidth: 200,
            }}
          >
            <Typography variant="subtitle1">Image: </Typography>
            {/* <Button variant=""></Button> */}
            <input
              accept="image/*"
              id="image-upload"
              name="image-upload"
              type="file"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span" disabled={isLoading}>
                {formData.image?.name ? formData.image.name : 'Upload'}
              </Button>
            </label>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="success" onClick={handleSubmit} disabled={!canClickMint}>
              Mint NFT
            </Button>
            {uploadMessage?.type === "error" && (
              <Box sx={{ color: "red" }}>{uploadMessage?.message}</Box>
            )}
            {uploadMessage?.type === "success" && (
              <Box sx={{ color: "green" }}>{uploadMessage?.message}</Box>
            )}
            {uploadMessage?.type === "info" && (
              <Box>{uploadMessage?.message}</Box>
            )}

          </Box>
        </Box>
        : <h2>Minting window is closed :(</h2>
      }


    </div>
  );
};

export default MintNFTForm;


