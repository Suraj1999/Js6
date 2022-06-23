const videoCardContainer=document.querySelector('.video-container');
let Api_Key="AIzaSyB6L6z5dUxbnGxtFHi71wxEUpjLAQbNnW0";
let Video_http="https://www.googleapis.com/youtube/v3/videos?";
let Channel_http="https://www.googleapis.com/youtube/v3/channels?";
var SearchLink="https://www.googleapis.com/youtube/v3/search?";

const SearchInput=document.querySelector('.search-bar')
const SearchBtn=document.querySelector('.search-btn')
SearchBtn.addEventListener('click',()=>{
    fetch(SearchLink + new URLSearchParams({
        key:Api_Key,
        part:'snippet',
        type:'video',
        q:SearchInput.value,
        chart:'mostPopular',
        maxResults:15,
        regionCode:'IN'
        
    }))
    .then(res=>res.json())
    .then(data=>{
      
        next_token=data.nextPageToken;
       
        data.items.forEach(item => {
            ShowViewCount(item);
        
        
        })
        data.items.forEach(item => {
         
              DisplayChannelIcon(item);
        })
    })
    NextPrevbutton()
})
const ShowViewCount=(video_data)=>{
   
    fetch(Channel_http + new URLSearchParams({
        key:Api_Key,
        part:'statistics',
        id:video_data.snippet.channelId

    }))
    .then(res=>res.json())
    .then(data=>{
        
          video_data.channelviewcount=data.items[0].statistics.viewCount;
          
      
    })
}


const DisplayChannelIcon=(video_data)=>{

    fetch(Channel_http+ new URLSearchParams({
        key:Api_Key,
        part:'snippet',
        id:video_data.snippet.channelId

    }))
    .then(res=>res.json())
    .then(data=>{
          
          video_data.channelTumbnail=data.items[0].snippet.thumbnails.default.url;
       
          MakeVideoCard(video_data)
          
      
    })
}

const MakeVideoCard=(search_data)=>{
  
    videoCardContainer.innerHTML+=`
    <div class="video" onclick="location.href='https://www.youtube.com/watch?v=${search_data.id.videoId}'">
    <img src="${search_data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
    <div class="content">
       <img src="${search_data.channelTumbnail}" class="channel-icon" alt="">
        <div class="info">
            <h4 class="title">${search_data.snippet.title}</h4>
            <p class="channel-name">${search_data.snippet.channelTitle}</p>
            <p class="views">.${search_data.channelviewcount}views</p>
            <p class="date">${search_data.snippet.publishedAt}</p>

        </div>
    </div>
</div>
`;

}
const NextPrevbutton=()=>{
    NextBtn.innerHTML+=`
<button type="button" class="btn1">NEXT</button>
`;
   PrevBtn.innerHTML+=`
   <button type="button" class="btn2">PREV</button>
   `;
}

const NextBtn=document.querySelector('.btn')
NextBtn.addEventListener('click',()=>{
    fetch(SearchLink +new URLSearchParams({
        key:Api_Key,
        part:'snippet',
        pageToken:next_token,
        q:SearchInput.value,
        maxResults:15
        
    }))
    .then(res=>res.json())
    .then(data=>{
        prev_token=data.prevPageToken;
      
        count=1;
        Remove();
        
        data.items.forEach(item => {
            ShowViewCount(item);
        
        })
        data.items.forEach(item => {
              DisplayChannelIcon(item);
        })
        
    })
})

const PrevBtn=document.querySelector('.btn_btn')

PrevBtn.addEventListener('click',()=>{
    fetch(SearchLink +new URLSearchParams({
        key:Api_Key,
        part:'snippet',
        pageToken:prev_token,
        q:SearchInput.value,
        maxResults:15
        
    }))
    .then(res=>res.json())
    .then(data=>{
        count=2;
        Remove();
       
        data.items.forEach(item => {
            ShowViewCount(item);
            
        })
        data.items.forEach(item => {
              DisplayChannelIcon(item);
        })
       
    })
})

function Remove() {
  
    const list = document.getElementById("main");
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
    }
  }  