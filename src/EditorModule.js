import React, { useState,useEffect } from "react";
import ReactDOM from "react-dom";
import Board, { moveCard, addColumn, addCard, removeCard } from "@lourenci/react-kanban";
import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';

const board = {
  columns: [
    {
      id: 1,
      title: "Simple Animations",
      cards: [
      ]
    }
  ]
};
let loaded=false
function ControlledBoard(props) {
    let sampleclips=props.sampleanim
    let callback=props.changeCalback
    const [controlledBoard, setBoard] = useState(board);

    useEffect(() => {
      callback(controlledBoard.columns.slice(1,controlledBoard.columns.length))
    }, [controlledBoard]);
  if(sampleclips&& sampleclips!==undefined && sampleclips.length>0 && loaded===false)
  {  
      
      for(let i=0;i<sampleclips.length;i++)
      {
        board.columns[0].cards.push({id:uuidv4(), title:sampleclips[i].name,column_id:controlledBoard.columns[0].id,_id:sampleclips[i]._id})
      
      }   
      loaded=true
       setBoard(board)
     

      
  }
  function handleCardMove(_card, source, destination) {
    _card["column_id"]=destination["toColumnId"]
    let updatedBoard = moveCard(controlledBoard, source, destination);
    if (source["fromColumnId"] === 1) {
      let copy = _.cloneDeep(_card);
      
      copy.id = uuidv4();
      console.log("copy",copy)
      updatedBoard = addCard(
        updatedBoard,
        { id: source["fromColumnId"] },
        copy
      );
    }
    
    setBoard(updatedBoard);
  }
  function handleColumnAdd(nameofcolumn) {
    const updatedBoard = addColumn(controlledBoard, nameofcolumn);
    updatedBoard.columns[updatedBoard.columns.length - 1][
      "id"
    ] = uuidv4();

    setBoard(updatedBoard);
  }
  function handleCardRemove(card)
  {   console.log(card)
      const updatedBoard = removeCard(controlledBoard, {"id":card.column_id}, card);
     
    setBoard(updatedBoard);
 
    

  }

  return (
    <Board
      allowAddColumn
      onNewColumnConfirm={handleColumnAdd}
      onCardDragEnd={handleCardMove}
      onColumnNew={console.log}
      disableColumnDrag
      allowRemoveCard
      onCardRemove={handleCardRemove}
      onCardNew={console.log}
    >
      {controlledBoard}
    </Board>
  );
}

function EditorModule(props) {
    
  return (
    <>
      <ControlledBoard sampleanim={props.sampleanim} changeCalback={props.onChange}/>
    </>
  );
}

export default EditorModule
