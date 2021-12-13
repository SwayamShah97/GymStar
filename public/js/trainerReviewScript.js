(function($) {
    // Below code is to show star on trainer review page
    // $(".starTR").click(function(){
    //     // e.preventDefault()
    //     const val = $(this).data('val');
        
    //     $("#starTR").val(val)
    //     console.log( $("#starTR").val())
    // })
    //End of trainer review star thing


    $("#submitTRB").click(function(){ //Trainer Review Submit Button
        // e.preventDefault()
        console.log('Clicked on submit trainer review')
        console.log('review' + $("#reviewTextTR").val())
        if(! $("#starTR").val() || !$("#reviewTextTR").val()){
            $("#error-star").html(`<p>Please provide rating and Review</p>`).show()
        }else{
            $('#trainer-review-form').submit()
        }
        
    })

    $("#submitTCreate").click(function(){  //Trainer creation form's submit button
        // e.preventDefault()
        console.log('Inside form submit')
        var gymId = $("#gymId").val(),
        trainerFirstName = $("#trainerFirstName").val(),
        trainerLastName = $("#trainerLastName").val(),
        emailId = $("#emailId").val(),
        phoneNo = $("#phoneNo").val(),
        gender = $("#gender").val(),
        experience = $("#experience").val()  

        if(trainerFirstName) {trainerFirstName = trainerFirstName.trim()}
        if(trainerLastName) {trainerLastName = trainerLastName.trim()}
        if(gymId) {gymId = gymId.trim()}
        if(emailId) {emailId = emailId.trim()}
        if(phoneNo) {phoneNo = phoneNo.trim()}
        if(gender) {gender = gender.trim()}
        if(experience) {experience = experience.trim()}

        let spregex = /[^\w]/g
        let spaceRegex = /\s/g
        let numberRegex = /[0-9]/g
        let phoneNumberRegex = /^\d{10}$/; // Google: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        let numRegex = /^\d+$/
        let objectIdRegex = /^[a-f\d]{24}$/i;

        if( !trainerFirstName || 
            !trainerLastName || 
            !gymId ||
            !gender ||
            !phoneNo || 
            !experience ||
            !emailId) {$("#errorTCreate").text('Kindly provide all the fields with Valid inputs').show()}
    
        
        else if(spaceRegex.test(trainerFirstName) ||
            spregex.test(trainerFirstName) ||
            numberRegex.test(trainerFirstName)) {$("#errorTCreate").text('Invalid First Name').show()}

        else if(spaceRegex.test(trainerLastName) ||
            spregex.test(trainerLastName) ||
            numberRegex.test(trainerLastName)) {$("#errorTCreate").text('Invalid Last Name').show()}
                
        else if(!(gender === 'Male' || 
            gender === 'Female' || 
            gender === 'Other'))  {$("#errorTCreate").text('Invalid Gender').show()}

        
        
        else if (!phoneNumberRegex.test(phoneNo)) {$("#errorTCreate").text('Invalid Phone Number').show()}
        

        
        else if(! emailRegex.test(emailId) ) {$("#errorTCreate").text('Invalid Email Id').show()}

        
        else if(! numRegex.test(experience)) {$("#errorTCreate").text('Kindly provide experience in years').show()}
        else if( parseInt(experience) < 0  || parseInt(experience) > 100 ) {$("#errorTCreate").text('Kindly provide experience in years').show()}

        else if (!objectIdRegex.test(gymId) )
            {$("#errorTCreate").text('Invalid gym Id').show()}
        
        var error = $("#errorTCreate").text().trim()
        // console.log($("#errorTCreate").text())
        console.log('error' + error)
        if(error){
            errorTCreate.removeAttribute('hidden');
            $("#errorTCreate").show()
        }else{
            $("#trainer-form").submit()
        }

    })


    //Filter
    $("#filterBtn").click(function(){
        // console.log('Client side Filter Validation')
        // console.log($("#rating").val() )
        // console.log($("#priceRange").val())
    
        // console.log(typeof($("#rating").val()))
        // console.log(typeof($("#priceRange").val()))
        if($("#rating").val() == null && $("#priceRange").val() == null){
            $("#errorFilter").text('Kindly select atleast one filter option').show()
            $(".gymlist-content").hide()
        }else{
            $("#filterForm").submit()
        }
    })

    $('#rating').on('change', function() {
        if(!(this.value == 0 ||
            this.value == 1 ||
            this.value == 2 ||
            this.value == 3 ||
            this.value == 4)
            ){
                this.value = null
            }
      });

      $('#priceRange').on('change', function() {
        if(!(this.value == '$' ||
            this.value == '$$' ||
            this.value == '$$$' ||
            this.value == '$$$$')
            ){
                this.value = null
            }
      });

      //Search AJAX form
      $("#searchBTN").click(function(){
          var searchTerm1 = $("#search-bar").val().trim()
          if($("#search-bar").val().trim().length === 0){
            $("#errorFilter").text('Kindly provide valid search term').show()
            $(".gymlist-content").hide()
          }else{
            var requestConfig = {
                method: 'POST',
                url: '/gyms/search' ,
                contentType: 'application/json',
                        data: JSON.stringify({
                            searchTerm: $("#search-bar").val()
                        })
            };
            var searchRes = undefined
            $.ajax(requestConfig).then(function(responseMessage) {
                
                $("#search-bar").text(searchTerm1) 
                console.log(responseMessage)
                let htmlText = ''
    
                if (responseMessage.error){
                    htmlText = `
                    
                        <div class="alert alert-danger text-goes-here">
                        ${responseMessage.error}
                        </div>
                    
                    `
                }else{
                    htmlText = ''
                    htmlText = '<h1 class="gym-title">Gyms</h1>'
                for(let d of responseMessage.searchResult){
                    htmlText += `
                    <br>
                    <div onclick="location.href='/gyms/${d._id}';" class="card" style="width:600px">
                    
                        <div class="card-body text-white bg-dark"> 
                            <h4 class="card-title">${d.gymName}</h4>
                            <h5 class="card-text">${d.location}</h5>
                            <h5 class="card-text">${d.priceRange}</h5>
                            <h5 class="card-text">${d.overallRating}</h5>
                            <h5 class="card-text">${d.phoneNumber}</h5>
                        </div>
                    </div> `
                }
                }
                
                // console.log(htmlText)
                $('.gymlist-content').html(htmlText).show()
                $("#errorFilter").hide()
                
            });
          }
          
        
      })
      //to block enter key on search form
      $('#searchForm').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
          e.preventDefault();
          return false;
        }
      });

      //Search using keyup
      $("#search-bar").keyup(function(){
          console.log($("#search-bar").val())
          var searchTerm1 = $("#search-bar").val().trim()
          if($("#search-bar").val().trim().length === 0){
            $("#errorFilter").text('Kindly provide valid search term').show()
            $(".gymlist-content").hide()
          }else{
            var requestConfig = {
                method: 'POST',
                url: '/gyms/search' ,
                contentType: 'application/json',
                        data: JSON.stringify({
                            searchTerm: $("#search-bar").val()
                        })
            };
            var searchRes = undefined
            $.ajax(requestConfig).then(function(responseMessage) {
                
                $("#search-bar").text(searchTerm1) 
                console.log(responseMessage)
                let htmlText = ''
    
                if (responseMessage.error){
                    htmlText = `
                    
                        <div class="alert alert-danger text-goes-here">
                        ${responseMessage.error}
                        </div>
                    
                    `
                }else{
                    htmlText = ''
                    htmlText = '<h1 class="gym-title">Gyms</h1>'
                for(let d of responseMessage.searchResult){
                    htmlText += `
                    <br>
                    <div onclick="location.href='/gyms/${d._id}';" class="card" style="width:600px">
                    
                        <div class="card-body text-white bg-dark"> 
                            <h4 class="card-title">${d.gymName}</h4>
                            <h5 class="card-text">${d.location}</h5>
                            <h5 class="card-text">${d.priceRange}</h5>
                            <h5 class="card-text">${d.overallRating}</h5>
                            <h5 class="card-text">${d.phoneNumber}</h5>
                        </div>
                    </div> `
                }
                }
                
                // console.log(htmlText)
                $('.gymlist-content').html(htmlText).show()
                $("#errorFilter").hide()
                
            });
          }
      })
    

})(window.jQuery)