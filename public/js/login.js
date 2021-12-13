(function($) {



    function checkInput(email,password){
        
        
        if(!email) throw "Email cannot be empty "
        if(!password) throw "Password cannot be empty "
    
        if(typeof(email) !== 'string') throw "email Not a string"
        if(typeof(password) !== 'string') throw "password Not a string"

        
        if(email.trim().length === 0) throw "Email cannot be empty"
        
        if(password.trim().length === 0) throw "Password cannot be empty"
        

        

        let regEmail = email.search(/^([a-zA-Z0-9_.+-]{1,})(@{1})([a-zA-Z]{1})([a-zA-Z0-9-]{1,})([.]{1})([a-zA-Z]{1,})$/gi);

        if (regEmail === -1) throw 'Email not valid'

        if(password.length <6) throw 'Password should atleast 6 character long'

        email = email.toLowerCase()
    }
  
    const subForm = document.getElementById("login-form");
  
    if(subForm){
        

      
      const email = document.getElementById('email');
      
      const password = document.getElementById('password');
      

      const errorContainer = document.getElementById('error-container');
      const errorTextElement = errorContainer.getElementsByClassName(
        'text-goes-here'
      )[0];
  
      subForm.addEventListener("submit", (event) =>{
        event.preventDefault();
        
  
        try{ 
          checkInput( email.value,  
            password.value)
          subForm.submit();
        }catch(e){
          errorTextElement.textContent = e;
          errorContainer.removeAttribute('hidden');
          
      }
      });
    }
  
  
  })();
    