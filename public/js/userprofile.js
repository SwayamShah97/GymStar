(function($) {



    function checkInput(role,firstname, lastname, email, city, 
        state, mobile, gender, dob){
        
        if(!role) throw "Role cannot be empty"
        if(!firstname) throw "Firstname cannot be empty"
        if(!lastname) throw "Lastname cannot be empty"
        if(!email) throw "Email cannot be empty"
        if(!city) throw "City cannot be empty"
        if(!state) throw "State cannot be empty"
        if(!mobile) throw "Mobile cannot be empty"
        if(!gender) throw "Gender cannot be empty"
        if(!dob) throw "Date of birth cannot be empty"
        // if(!password) throw "Password cannot be empty"
        

      
        if(typeof(role) !== 'string') throw "role Not a string"
        if(typeof(firstname) !== 'string') throw "firstname Not a string"
        if(typeof(lastname) !== 'string') throw "lastname Not a string"
        if(typeof(email) !== 'string') throw "email Not a string"
        if(typeof(city) !== 'string') throw "city Not a string"
        if(typeof(state) !== 'string') throw "state Not a string"
        if(typeof(mobile) !== 'string') throw "mobile Not a string"
        if(typeof(gender) !== 'string') throw "gender Not a string"
        if(typeof(dob) !== 'string') throw "dob Not a string"
        // if(typeof(password) !== 'string') throw "password Not a string"
        


        if(role.trim().length === 0) throw "Role cannot be empty"
        if(firstname.trim().length === 0) throw "Firstname cannot be empty"
        if(lastname.trim().length === 0) throw "Lastname cannot be empty"
        if(email.trim().length === 0) throw "Email cannot be empty"
        if(city.trim().length === 0) throw "City cannot be empty"
        if(state.trim().length === 0) throw "State cannot be empty"
        if(mobile.trim().length === 0) throw "Mobile cannot be empty"
        if(gender.trim().length === 0) throw "Gender cannot be empty"
        if(dob.trim().length === 0) throw "Date of birth cannot be empty"
        // if(password.trim().length === 0) throw "Password cannot be empty"
        

        let regMob = mobile.search(/^\d{10}$/);

        if(regMob=== -1) throw 'PhoneNumber not valid'

        let regEmail = email.search(/^([a-zA-Z0-9_.+-]{1,})(@{1})([a-zA-Z]{1})([a-zA-Z0-9-]{1,})([.]{1})([a-zA-Z]{1,})$/gi);

        if (regEmail === -1) throw 'Email not valid'

        // if(password.length <6) throw 'Password should atleast 6 character long'

        if(role != 'user' && role != "owner") throw "Select valid role"

        if(city != "Jersey City" && city != "Hoboken") throw "Select valid city"
    
        if(state != "New Jersey" ) throw "Select valid state"

        if(gender != "male" && gender != "female" && gender != "other") throw "Select valid Gender"

        
        email = email.toLowerCase()
    }
  
    const subForm = document.getElementById("update-form");
  
    if(subForm){
        if (document.getElementById('r1').checked) {
             role = document.getElementById('r1').value;
          }
        if (document.getElementById('r2').checked) {
             role = document.getElementById('r2').value;
          }

      const firstname = document.getElementById('firstname');
      const lastname = document.getElementById("lastname");
      const email = document.getElementById('email');
      const city = document.getElementById('city');
      const state = document.getElementById('state');
      const mobile = document.getElementById('mobile');
      const gender = document.getElementById('gender');
      const dob = document.getElementById('dob');
    //   const password = document.getElementById('password');
      
      const errorContainer = document.getElementById('error-container');
      const errorTextElement = errorContainer.getElementsByClassName(
        'text-goes-here'
      )[0];
  
      subForm.addEventListener("submit", (event) =>{
        event.preventDefault();
        
  
        try{ 
          checkInput(role,firstname.value, lastname.value, email.value, city.value, 
            state.value, mobile.value, gender.value, dob.value)
          subForm.submit();
        }catch(e){
          errorTextElement.textContent = e;
          errorContainer.removeAttribute('hidden');
          
      }
      });
    }
  
  
  })();
    