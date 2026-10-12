import * as React from 'react';
import { useState, useEffect } from 'react';

import { IconButton, Button } from '@mui/material';
import {Grid, Card, CardContent, Typography, Box} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateIcon from '@mui/icons-material/Create';
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

function ItemGrid({
    filteredData,
    formatDate,
    handleDeleteItem,
    typeData, // using the id from filteredData for a specific item, get the name of the type and the created_at
    selectedID,
    handleSetID,
    handleEditItem
    }) {
        const pageLimit = 30; // amount per page
        
        const [pageNumber, setPageNumber] = useState(0); // current page number the user is on (starts at 0)
        const [pagedData, setPagedData] = useState([]); // 

        // reset the page number to 0 upon any change in filteredData
        useEffect(() => {
            setPageNumber(0);
        }, [filteredData]);

        // update pagedData upon any change in filteredData
        useEffect(() => {
            const start = pageNumber*pageLimit;
            const end = start+pageLimit;
            
            const slicedItems = filteredData.slice(start,end);
            setPagedData(slicedItems);
        }, [filteredData, pageLimit, pageNumber]); 

        // handle the user pressing the page changing buttons
        const handlePageChange = (pageChange) => {
            const maxPage = Math.max(0,Math.ceil(filteredData.length/pageLimit)-1); //max final page

            if(pageChange === 0){
                if(pageNumber === 0){
                    setPageNumber(maxPage);
                }
                else{
                    setPageNumber(0);
                }
            }
            else if(pageChange === -1){
                setPageNumber(prev => Math.max(0, prev - 1));
            }
            else if(pageChange === 1 && pageNumber*pageLimit < filteredData.length){
                setPageNumber(prev => Math.min(maxPage, prev + 1));
            }
        };
    return (
    <Box sx={{ width: '99vw'}}>
    {filteredData.length > 0 ? 
    <Grid container spacing={2} mt={4} justifyContent={'center'} 
    className="item-grid"
    sx={{px: 4, pr: 4, maxHeight:'calc(80vh - 80px)', overflowY:'Auto', alignContent:'flex-start'}}
    >
            {pagedData.map((item) => (
                <Grid key={item.id} sx={{minWidth:0, width:"100%"}}>
                    <Card 
                        sx={{
                            backgroundColor: item.id === selectedID ? "#5f883b": "#3e4132",
                            color: "white", width: "90%", mx: "auto", overflow: "hidden", height: "auto"
                        }}
                    >
                        <CardContent>
                            <Grid container spacing={1} alignItems="center" sx={{ width: '100%' }}> 
                                <Grid size={{xs:12, md: 1 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Tooltip title={item.id === selectedID ? "De-Select" : "Select"} arrow>
                                        <IconButton 
                                            onClick={() => handleSetID(item.id, item.date, typeData[item.type_id-1], item.name, item.description)}
                                            sx={{bgcolor:"#ffffff"}}
                                            >
                                            {item.id === selectedID ? 
                                                <CheckCircleIcon /> 
                                                : 
                                                <RadioButtonUncheckedIcon /> 
                                            }
                                        </IconButton>
                                    </Tooltip>
                                    
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: 'center' }}> 
                                    <Typography variant="h6">
                                        {formatDate(item.date)}
                                    </Typography>
                                    
                                    <Typography variant="h6">
                                        {/* if the name is the same as the type or the name contains the type, */}
                                        {/* set the text to the format 'name'. */}
                                        {/* otherwise, */}
                                        {/* set the text to the format 'type - name' */}

                                        {typeData && typeData[item.type_id - 1] ? (
                                            ((typeData[item.type_id - 1] === item.name) || item.name.includes(typeData[item.type_id - 1])) 
                                            ? (item.name) 
                                            : (`${typeData[item.type_id - 1]} - ${item.name}`)
                                        ) : ("Loading...")}
                                    </Typography>
                                    
                                </Grid>
                                
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body1" mt={1} sx={{wordBreak: "break-word", overflowWrap: "break-word", whiteSpace: "normal", display: "block"}}>
                                        {item.description}
                                    </Typography>
                                </Grid>
                                
                                <Grid size={{ xs: 12, md: 2 }} sx={{display: 'flex', justifyContent: 'center'}}>
                                    <Box sx={{ display: "flex", flexWrap:"wrap", minWidth: "25px", gap: 1, mt: 1, justifyContent: "center", backgroundColor:'#000000', borderRadius: '10px'}}>
                                        {item.id === selectedID && <IconButton 
                                            onClick={() => handleEditItem()}
                                            variant="contained" color="info" size="small" 
                                            >
                                            <Tooltip title="Edit Item" arrow>
                                                <EditIcon sx={{"&:hover": { color: "#afc8fb" }}}/>
                                            </Tooltip>
                                        </IconButton>}

                                        {item.id === selectedID && <IconButton variant="contained" color="error" size="small" onClick={() => handleDeleteItem(item.id)}>
                                            <Tooltip title="Delete Item" arrow>
                                                <DeleteIcon sx={{"&:hover": { color: "#afc8fb" }}}/>
                                            </Tooltip>
                                        </IconButton>}
                                    </Box>
                                </Grid>
                            </Grid>
                            
                        </CardContent>
                    </Card>
                </Grid>
            ))}
            </Grid>
            : <Typography variant="h2" component="h1" 
                sx={{ 
                    color: "#ffffff", 
                    mt: 6, 
                    ml: 3,
                    mr: 3,
                    mb: 6,
                    textAlign: "center", 
                    fontWeight: "bold" 
                }}>
                    <CreateIcon fontSize="huge" sx={{backgroundColor:"#ff9f00"}}/> Add an entry to get started
                </Typography>}
            
                <Box sx={{display: 'flex', alignItems:'center',justifyContent: 'center',mt: 0.5}}>
                    <Tooltip title={`Prev`} arrow>

                        <Button
                            onClick={() => handlePageChange(-1)} 
                            disabled={pageNumber===0}
                            sx={{ mr:1, transition: "all 0.3s ease",
                                color: "#fefefe",
                                backgroundColor: "secondary.main",
                                "&:hover": {
                                    backgroundColor: "#4f86f8",
                                    color: "#00ff66",
                                }
                            }}
                            >
                            <KeyboardArrowLeftIcon />
                        </Button>
                    </Tooltip>
                    
                    <Tooltip title={pageNumber === 0 ? `Jump to Last Page` : "Jump to First Page"} arrow>
                        <Button
                            onClick={() => handlePageChange(0)} 
                            sx={{transition: "all 0.3s ease",
                                color: "#fefefe",backgroundColor: "secondary.main",
                                "&:hover": {backgroundColor: "#4f86f8",color: "#00ff66",}
                            }}
                        >
                            {`${pageNumber+1} / ${Math.max(0, Math.ceil(filteredData.length/pageLimit)-1)+1}`}
                        </Button>
                    </Tooltip>

                    <Tooltip title={`Next`} arrow>
                        <Button
                            disabled={pageNumber===Math.ceil(filteredData.length/pageLimit)-1}
                            onClick={() => handlePageChange(1)} 
                            sx={{ ml: 1, transition: "all 0.3s ease",
                                color: "#fefefe",
                                backgroundColor: "secondary.main",
                                "&:hover": {
                                    backgroundColor: "#4f86f8",
                                    color: "#00ff66",
                                }
                            }}
                            >
                            <KeyboardArrowRightIcon />
                        </Button>
                    </Tooltip>

                </Box>
                
        </Box>
    );
}

export default ItemGrid;