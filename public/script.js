
$(document).ready(function() {
  $('#banner').on('click', function(event) {
    $(this).toggleClass('top');
  });

  // $('#playBattleshipButton').on('click', function(event) {
  //   axios.get('/newGame')
  // })


  $('#playerOneButton').on('click', function(event) {
    // $(this).hide();
    axios.post('/newPlayerOne')
    .then(response => {
      console.log('here is my player One response', response)
      document.location.href = response.data.redirect
    })
    .catch((error) => {
      console.log(error)
    });
  });



  $('#playerTwoButton').on('click', function(event) {
    // $(this).hide();
    axios.post('/newPlayerTwo')
    .then(response => {
      console.log('here is my player 2 response', response)
      document.location.href = response.data.redirect
    })
    .catch((error) => {
      console.log(error)
    });
  });


  // function createBoard(){
  //   for (y = 0; y < 10; y++){
  //     for (var x = 0; x < 10; x++){
  //       $('#container').append("<div class='grid'></div>");
  //     }
  //   }
  //   $(".grid").width(960/10);
  //   $(".grid").height(960/10);
  // }

  $('#emptyBoardButton').on('click', function(event) {
    for (var y = 0; y < 10; y++){
      for (var x = 0; x < 10; x++){
        $('#container').append(`<div id='${x},${y}' class='grid'></div>`);
      }
    }
    $(".grid").width(500/10);
    $(".grid").height(500/10);
  });

  $('#randomBoardButton').on('click', function(event) {
    console.log('button pressed')
    for (var y = 0; y < 10; y++){
      for (var x = 0; x < 10; x++){
        $('#container').append(`<div id='${x},${y}' class='grid'></div>`);
      }
    }
    $(".grid").width(500/10);
    $(".grid").height(500/10);
  });

  $('#findAllPlayersButton').on('click', function(event) {
    console.log('find all players button pressed')
    axios.get('/findGamePlayers')
    .then(response => {
      console.log('Here are all the players:', response)
    })
    .catch(err => {
      console.log(err)
    })
  })

});
