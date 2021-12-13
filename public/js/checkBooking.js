(function($) {



    function checkInput(date, time){
  
        if(!date) throw "Your date can not be empty."
        if(!time) throw "You need to provide a time."
        if(typeof(date) !== 'string') throw "Your date type must be string"
        if(typeof(time) !== 'string') throw "Your time type must be string"
        if(date.trim().length === 0) throw "Your date can not be all space"
        if(time.trim().length === 0) throw "Your time can not be all space"
        if(date.length !== 10) throw "The date is not a vaild date"
        if(date.substring(2,3) !== "/" && date.substring(5,6) !== "/" ) throw "The date is not a vaild date"

        if(isNaN(+date.substring(0,2)) || isNaN(+date.substring(3,5))|| isNaN(+date.substring(6,10))) throw "The date is not a vaild date"

        if(date.substring(0,2).trim().length === 0 ||date.substring(3,5).trim().length === 0|| date.substring(6,10).trim().length === 0 ) throw "The date include space"

        if(parseInt(date.substring(0,2)) > 12 || parseInt(date.substring(0,2)) < 0) throw "The input date is not a vaild day" 
        
        if(parseInt(date.substring(3,5)) > 31 || parseInt(date.substring(0,2)) < 0) throw "The input date is not a vaild day" 

        if(parseInt(date.substring(0,2)) === 2 && parseInt(date.substring(3,5)) > 28 ) throw "The input date is not a vaild day "

        if(parseInt(date.substring(0,2)) === 4 && parseInt(date.substring(3,5)) > 30 ) throw "The input date is not a vaild day "

        if(parseInt(date.substring(0,2)) === 6 && parseInt(date.substring(3,5)) > 30 ) throw "The input date is not a vaild day "

        if(parseInt(date.substring(0,2)) === 9 && parseInt(date.substring(3,5)) > 30 ) throw "The input date is not a vaild day "

        if(parseInt(date.substring(0,2)) === 11 && parseInt(date.substring(3,5)) > 30 ) throw "The input date is not a vaild day "
        
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();


        if(time.length !== 5) throw "The time is not a valid time."
        if(isNaN(+time.substring(0,2)) || isNaN(+time.substring(3,5))) throw " The time is not a valid time."
        if(parseInt(time.substring(0,2)) > 24 || parseInt(time.substring(0,2)) < 0 ) throw "The time is not a valid time."
        if(parseInt(time.substring(3,5)) > 60 || parseInt(time.substring(3,5)) < 0)throw "The time is not a valid time."


        today = mm + '/' + dd + '/' + yyyy; 
        if(Date.parse(date) < Date.parse(today)) throw "The date must after current date"

    }
  
    const subForm = document.getElementById("make_an_order");
  
    if(subForm){
      const datePick = document.getElementById("new_order_date");
      const timePick = document.getElementById("new_order_time");
      const errorContainer = document.getElementById('error-container');
      const errorTextElement = errorContainer.getElementsByClassName(
        'text-goes-here'
      )[0];

      
  
      subForm.addEventListener("submit", (event) =>{
        event.preventDefault();

  
        try{ 
          checkInput(datePick.value, timePick.value)
          subForm.submit();
        }catch(e){
          errorTextElement.textContent = e;
          errorContainer.removeAttribute('hidden');
      }
      });
    }
  
  
  })();
    