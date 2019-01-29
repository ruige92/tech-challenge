const URL = "http://localhost:3000";

//On document ready, start initial fetch on all the users data
$(document).ready(() => {
  $.get(`${URL}/users`, data => {
    //Once we have the data, call buildUserList to build the users pane
    buildUserList(data);
  });
});

//Function that builds the initial users pane on the left
const buildUserList = userData => {
  //Loop through each user object, grab relevant information and append it to the DOM
  userData.forEach(user => {
    const { id, name } = user;
    const html = `<a href="#!"user-id=${id} class="collection-item user-list-item">${name}</a>`;
    $("#user-list").append(html);
  });

  //Click event call for when user click on to a individual user name in the user pane.
  $(".user-list-item").click(function() {
    //UI - add active to current selected user, clear all other active classes
    $(this).addClass('active')
    $(this).siblings().removeClass('active')

    //Storing user Id into the userId variable
    const userId = $(this).attr("user-id");
    //Storing user name into the userName variable
    const userName = $(this).text();
    //Passing both user id and user name over to the onSelectUser function
    onSelectUser(userId,userName);
  });
};

//Handles the click event when user click on a user's name on the user-list.
const onSelectUser = (userId,userName) => {

  console.log(window.location.hash)
  //Originally the album-list div is set to hidden, First click should make the div container display.
  //Simple check if the hidden class is there on the DOM, if so, remove it, otherwise, skip.
  if($('#album-list').hasClass('hidden')){
    $('#album-list').removeClass('hidden');
  }
  //Initialise the album pane by remove old data in the album-dropdown div container
  //Simple check, if there is content inside this div then remove it first.
  if( $('#album-dropdown').children().length !==0 ){
    $('#album-dropdown').empty();
  }
  //When selecting a user, initialise all the albums by setting all albums to hidden.
  if( $('#photo-container').children().length !== 0 ){
    $('#photo-container .album').addClass('hidden')
  }

  //First, set username to the current user that was selected.
  $("#user-name").text(userName)
  //Second, start fetching album data using userId as param
  $.get(`${URL}/${userId}/album`, data => {
    //Call the build Album function and pass the data retrieved from the fetch call
    buildAlbum(data)
  });
  console.log(`Now get user ${userId}'s albums...`);
};

//Function that builds the Album Selection control pane. (Dropdown only)
const buildAlbum = userAlbums => {
  // First add the default 'choose an album option'
  const content = `<option value="" disabled selected> Choose an Album </option>`
  $("#album-dropdown").append(content);
  //Loop through the data and append each individual sub data into the #album-dropdown select container
  userAlbums.forEach(album => {
    const { id, title, userId } = album;
    const content = `<option value=${id} user-id=${userId} class="album-item">${title}</option>`
    // const html = `<a href="#!" user-id=${userId} album-id=${id} class="collection-item user-list-item">${title}</a>`;
    // const html = `<select>${content}</select>`
    $("#album-dropdown").append(content);
  });

  //Call materialize's select function, as it override browser default
  //Without running this command the select won't render correctly into the view
    $('select').material_select();
    //Using unbind to remove existing event handlers, avoid the event from firing multiple times.
    $('#album-dropdown').unbind().on('change',function(){
      //Use $(this).attr('user-id') will look for user-id on the select tags not option
      //Therefore using $('option:selected',this) instead so that it gets the attribute from selected option
      const userId = $('option:selected', this).attr('user-id');
      const albumId = $(this).val();

      //Whenever changing album, first thing to do is to hide all albums, like initialise step
      $('#photo-container .album').addClass('hidden')
      //Second step, check do we already have a album in the DOM with userId_albumId as id attr
      //If we do then there will be a length value (true), meaning no need to fetch again, simply show this
      //If there isn't one, then perform fetch
      if( $('#photo-container').find(`#album_${userId}_${albumId}`).length ){
        $('#photo-container').find(`#album_${userId}_${albumId}`).removeClass('hidden')
      }else{
        onAlbumSelect(userId, albumId);
      }
      //Passing userId and albumId into the function, so they can be used to fetch correct data from back-end
    })
};

//Event handler for when a user select (change) an album from the album dropdown
const onAlbumSelect = (userId, albumId) =>{
  //First, initialise by remove old data in the photo-inner-container div container
  $("#photo-inner-container").empty();
  //Second, start fetching data on selected album
  //userId is not necessary with this setup, however, it might be useful in different scenario.
  $.get(`${URL}/${userId}/album/${albumId}`,data=>{
    //Calling buildphotos method once we have all the data.
    buildPhotos(data,userId,albumId)
  })
}

//Function for building the photo pane
const buildPhotos = (photoData,userId,albumId) =>{
  console.log(userId)
  console.log(albumId)
  //Loop through individual photo objects, grab data needed and append it to the DOM
  let content=[];
  photoData.forEach(photo=>{
    const { url, title, thumbnailUrl } = photo;

    content.push(
      `<div class="col s3 photo-wrapper" image-url=${url}>
        <img class="responsive-img modal-trigger waves-effect waves-light " href="#modal1" src=${thumbnailUrl} alt=${title}/>
        <span>${title}</span>
        <img class="like-btn" src='./svg/unliked.svg' alt="like button"/>
      </div>`
    )

    // $("#photo-inner-container").append(content)
  })
  //Using join to remove all the commas since they are pushed into an array..
  content = content.join('');
  //So that each album will have unique id attribute, easier to hide and show individual albums later on..
  $('#photo-container').append('<div class="album" id=album_'+userId+'_'+albumId+'>'+content+'</div>')

  //Click event for when clicking on individual images, to trigger the modal
  $('.photo-wrapper').on('click',function(){
    //initialise by checking and removing existing album data in the modal
    if( $('.modal-content').children.length !==0 ){
      $('.modal-content').empty();
    }
    //Storing the full resolution image path into image variable
    const image = $(this).attr('image-url');
    //Storing the image title into the title variable
    const title = $(this).find('span').text();

    if( $(this).find('.like-btn').attr('src')==='./svg/liked.svg' ){
      const m_content = `<div class="modal-wrapper"><h1>${title}</h1><img src=${image} alt=${title}/><span>You've liked this <img class="modal-like-btn" src='./svg/liked.svg' alt="like button"/></span></div>`
      $('.modal-content').append(m_content)
      $('.modal').modal();
    }else{
      const m_content = `<div class="modal-wrapper"><h1>${title}</h1><img src=${image} alt=${title}/></div>`
      $('.modal-content').append(m_content)
      $('.modal').modal();
    }
  })

  //Using unbind to make sure only fire once..
  $('.like-btn').unbind().on('click',function(){
    if( $(this).attr('src')==='./svg/unliked.svg' ){
      // console.log('unliked, trying to like')
      $(this).attr('src','./svg/liked.svg')
      $(this).siblings('img').addClass('like-frame')
    }else{
      // console.log('liked, trying to unlike')
      $(this).attr('src','./svg/unliked.svg')
      $(this).siblings('img').removeClass('like-frame')
    }
  })
}

//Using unbind to make sure only fire once..
$('.modal-like-btn').on('click',function(){
  console.log('fired')

})
