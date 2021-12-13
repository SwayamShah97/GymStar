(function($) {


  function checkString(string){
    if(typeof(string) !== 'string') throw 'Input provided is not a string';
    if(string.trim().length === 0) throw 'Empty string on input';
  }

  function check(gymname,location,number,pricerange){
    
    if(!gymname) throw 'You must provide a gym name to add gym';
    if(!location) throw 'You must provide a location to add gym';
    if(!number) throw 'You must provide a phone number to add gym';
    if(!pricerange) throw 'You must provide a price range to add gym';
    checkString(gymname)
    checkString(location);
    checkString(number);
    checkString(pricerange);
    
    let regMob = number.search(/^\d{10}$/);
    if(regMob=== -1) throw 'PhoneNumber not valid';
    if(!(pricerange=== '$' || pricerange=== '$$' || pricerange=== '$$$' || pricerange=== '$$$$')) throw 'Price Range is not between $ to $$$$';
    location = location.toLowerCase();
    if(location!= "jersey city" && location != "hoboken") throw "Select valid city"
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
          check(gymname.value, location.value, number.value, pricerange.value)
          subForm.submit();
        }catch(e){
          errorTextElement.textContent = e;
          errorContainer.removeAttribute('hidden');
          
      }
      });
    }
  
  
  })();
     