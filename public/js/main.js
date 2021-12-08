(function () {
    function isPalin(str) {

        let str1 = str.replace(/[^A-Z0-9]/ig, "").toLowerCase();

        let str2 = str1.split('').reverse().join('');
       if(str1.length === 0) throw 'String must have atleast one alphanumeric character'
        if (str1 === str2){
            return true;
        }
        else{
            return false;
        }
    }
  
    const check = document.getElementById("check-palin");
  

    if (check) {
    
        let str = document.getElementById("phrase");
        let ol = document.getElementById("attempts");

        check.addEventListener("submit", event => {
            event.preventDefault();
            try{
                let str0 = str.value;
                let palin = isPalin(str0);
                let li = document.createElement("li");
                if(palin){
                    li.innerHTML=str0;
                    li.setAttribute("class", "is-palindrome");
                    check.reset()
                }
                else{
                    li.innerHTML=str0;
                    // li.appendChild(document.createTextNode(`${str0} is not Palindrome`))
                    li.setAttribute("class", "not-palindrome");
                    check.reset()
                }
                ol.appendChild(li);
                // str.value = "";
            }
            catch(e){
                const message = typeof e === "string" ? e : e.message;
                alert(message);
            }
          });    
    }
  })();