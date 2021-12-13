(function($) {



  function checkInput(review, rating){

      if(!review) throw "Your review can not be empty."
      if(!rating) throw "You need to provide an rating scores."
      if(typeof(review) !== 'string') throw "Your review type must be string"
      if(typeof(rating) !== 'string') throw "Your rating type must be string"
      if(review.trim().length === 0) throw "Your review can not be all space"
      if(rating.trim().length === 0) throw "Your rating can not be all space"
      if(rating.length !== 1) throw "Your rating can not incude decimal numbers"
      if(typeof(rating) === 'string' && isNaN(+rating)) throw "Your rating must be a vaild number"
      if(parseInt(rating) < 0 || parseInt(rating) > 5) throw "Your score must between 1 to 5"
  }

  const subForm = document.getElementById("add_reivew");

  if(subForm){
    const reviewInformation = document.getElementById("your_reivew");
    const ratingScore = document.getElementById("your_rating");
    const errorContainer = document.getElementById('error-container');
    const errorTextElement = errorContainer.getElementsByClassName(
      'text-goes-here'
    )[0];
    console.log(reviewInformation.value)
    console.log(reviewInformation)
    

    subForm.addEventListener("submit", (event) =>{
      event.preventDefault();
      console.log(reviewInformation.value)
      console.log(reviewInformation)

      try{ 
        checkInput(reviewInformation.value, ratingScore.value)
        subForm.submit();
      }catch(e){
        errorTextElement.textContent = e;
        errorContainer.removeAttribute('hidden');
    }
    });
  }


})();
  