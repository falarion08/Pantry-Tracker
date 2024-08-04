'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, TextField, Typography, Stack, Button } from "@mui/material";
import { collection, deleteDoc, doc,setDoc, getDoc, getDocs, query } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })

    setInventory(inventoryList);
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();

      if (quantity === 1) {
        await deleteDoc(docRef);
      }
      else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory();
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  

  useEffect(() => {
    updateInventory();
  }, []);



  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>

        <Modal open={open} handleClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button variant="outlined" onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}>Add</Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" onClick={() => {
          handleOpen();
        }}>Add New Item</Button>

        <Box
          border="1px solid black #333">
          <Box
            width="800px" height="100px"
            bgcolor="#ADD8E6"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h2" color="#333">Inventory Items</Typography>

          </Box>
        </Box>
        <Box width="800px">
          <TextField onChange={(e)=>setSearchFilter(e.target.value)} width="80%" id="outlined-search" label="Search for item" type="search"/>

        </Box>

        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {
          inventory.map(({ name, quantity }) => {
            if(searchFilter.toLowerCase() == name.toLowerCase() || searchFilter == "" )
              return <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => addItem(name)}>
                Add
              </Button>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          })}
        </Stack>
      </Box>
    </>

  );
}
