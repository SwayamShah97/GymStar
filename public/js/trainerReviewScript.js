(function($) {
    $(".starTR").click(function(){
        // e.preventDefault()
        const val = $(this).data('val');
        
        $("#starTR").val(val)
        console.log( $("#starTR").val())
    })
    $("#submitTRB").click(function(){
        // e.preventDefault()
        console.log('Clicked on submit trainer review')
        console.log('review' + $("#reviewTextTR").val())
        if(! $("#starTR").val() || !$("#reviewTextTR").val()){
            $("#error-star").html(`<p>Please provide rating and Review</p>`).show()
        }else{
            $('#trainer-review-form').submit()
        }
        
    })

    $("#submitTCreate").click(function(){
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
        
        var error = $("#errorTCreate").text()
        console.log($("#errorTCreate").text())
        console.log('error' + error)
        if(error){
            $("#errorTCreate").show()
        }else{
            $("#trainer-form").submit()
        }

    })

})(window.jQuery)