import * as React from 'react';

import { IconButton } from '@mui/material';
import {Grid, Card, CardContent, Typography, Box} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tooltip from '@mui/material/Tooltip';

function ItemGrid({
    filteredData,
    formatDate,
    handleDeleteItem,
    typeData, // using the id from filteredData for a specific item, get the name of the type and the created_at
    selectedID,
    handleSetID,
    handleEditItem
    }) {
    return (
    <Box sx={{ width: '99vw'}}>
    <Grid container spacing={2} mt={4} justifyContent={'center'} 
        className="item-grid"
        sx={{px: 4, pr: 4, maxHeight:'calc(80vh - 80px)', overflowY:'scroll', alignContent:'flex-start'}}
        >
            {filteredData.map((item) => (
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
                                            onClick={() => handleSetID(item.id, item.date, typeData[item.type_id-1].name, item.name, item.description)}
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
                                            ((typeData[item.type_id - 1].name === item.name) || item.name.includes(typeData[item.type_id - 1].name)) 
                                            ? (item.name) 
                                            : (`${typeData[item.type_id - 1].name} - ${item.name}`)
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
        </Box>
    );
}

export default ItemGrid;