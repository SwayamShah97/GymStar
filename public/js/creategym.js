(function($) {



    function checkInput(gymname,location,number,pricerange){
  
        if(!gymname) throw "Gym name cannot be empty"
        if(!location) throw "Location cannot be empty"
        if(!number) throw "Please provide a Phone number"
        if(!pricerange) throw "Please provide a price range"
        if(typeof(gymname) !== 'string') throw "Not a string"
        if(typeof(location) !== 'string') throw "Not a string"
        if(typeof(pricerange) !== 'string') throw "Not a string"
        if(gymname.trim().length === 0) throw "Gym name cannot be empty"
        if(location.trim().length === 0) throw "Location cannot be empty"
        if(pricerange.trim().length === 0) throw "Price range cannot be empty"
    }
  
    const subForm = document.getElementById("signup-form");
  
    if(subForm){
      const gymname = document.getElementById('firstname');
      const location = document.getElementById('city');
      const number = document.getElementById("mobile");
      const pricerange = document.getElementById('price');
      const errorContainer = document.getElementById('error-container');
      const errorTextElement = errorContainer.getElementsByClassName(
        'text-goes-here'
      )[0];
      
      
  
      subForm.addEventListener("submit", (event) =>{
        event.preventDefault();
        
  
        try{ 
          checkInput(gymname.value, location.value, number.value, pricerange.value)
          subForm.submit();
        }catch(e){
          errorTextElement.textContent = e;
          errorContainer.removeAttribute('hidden');
          
      }
      });
    }
  
  
  })();
    