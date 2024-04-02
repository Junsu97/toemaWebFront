import React from 'react';
import './App.css';
// import latestBoardListMock from 'mocks/latest-board-list.mock';
import BoardListItem from 'components/BoarListItem';
import Top3Item from 'components/Top3Item';
// import top3BoardListMock from 'mocks/top-3-board-list.mock';
import { latestBoardListMock, top3BoardListMock, commentListMock,favoriteListMock } from 'mocks';
import CommentItem from 'components/CommentItem';
import FavoriteItem from 'components/FavoriteItem';


function App() {
  return (
    <>
    {/* <div style={{display: 'flex', justifyContent: 'center', gap:'24px'}}>
        {top3BoardListMock.map(top3ListItem => <Top3Item top3ListItem={top3ListItem}/>)}
    </div> */}


    {/* {latestBoardListMock.map(boardListItem => <BoardListItem boardListItem={boardListItem}/>)} */}
    

      {/* <div style={{padding: '0 20px', display:'flex', flexDirection: 'column', gap:'30px'}}>
        {commentListMock.map(commnetListItem => <CommentItem commentListItem={commnetListItem}/>)}
      </div> */}

      <div style={{padding: '0 20px', display:'flex', columnGap:'30px', rowGap:'20px'}}>
        {favoriteListMock.map(favoriteListItem => <FavoriteItem favoriteListItem={favoriteListItem}/>)}
      </div>
    </>
  );
}

export default App;
