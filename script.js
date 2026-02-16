document.addEventListener("DOMContentLoaded", function(){
    const searchButton=document.getElementById("search-btn");
    const usernameinput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easyLabel=document.querySelector("#easy-label");
    const mediumLabel=document.querySelector("#medium-label");
    const hardLabel=document.querySelector("#hard-label");
    const cardStatsContainer=document.querySelector(".stats-card");

    // return true if username is valid else false
    function validateUsername(username){
        if(username.trim()===""){
            alert("Username should not be empty!");
            return false;
        }
        const regex=/^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching=regex.test(username);
        if(!isMatching){
            alert("Invalid Username!");
        }
        return isMatching;
    }

    async function fetchUserDetails(username){
        const url=`https://alfa-leetcode-api.onrender.com/${username}/solved/`;
        try{
            // searchButton.textContent="Searching...";
            // searchButton.disabled=true;

            // //const responce=await fetch(url);
            // const proxyUrl='https://cors-anywhere.herokuapp.com/';
            // const Url='https://leetcode.com/graphql/';
            // const header=new Headers();
            // header.append("content-type", "application/json");

            // const graphql=JSON.stringify({
            //     query: "\n query userSessionProgress($username: String!) {\n allQuestionsCount {\n difficulty\n count\n }\n matchedUser (username: $username) {\n submitStats {\n acSubmissionNum {\n difficulty\n count\n submissions\n } \n totalSubmissionNum {\n difficulty\n count\n submissions\n }\n }\n }\n }\n ",
            //     variables:{"username":`${username}`}
            // })

            // const requestOptions={
            //     method:"GET",
            //     headers:header,
            //     body:graphql,
            //     redirect:"follow"
            // };

            const responce=await fetch(url);

            if(!responce.ok){
                throw new Error("Unable to fetch the User Details");
            }
            const parsedData=await responce.json();
            console.log("Logging user data: ",parsedData);
            displayUserData(parsedData);
        }catch(error){
            console.log(error);
            statsContainer.innerHTML=`<p>No Data Found</p>`;
        }finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
    }

    function updateProgress(solved, total, label, circle){
        const progressDegree=(solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent=`${solved}/${total}`;
    }

    function displayUserData(parsedData){
        const totalQues=3816;
        const totalEasyQues=920;
        const totalMediumQues=1920
        const totalHardQues=900;
        const solvedQues=parsedData.acSubmissionNum[0].count;
        const solvedEasyQues=parsedData.acSubmissionNum[1].count;
        const solvedMediumQues=parsedData.acSubmissionNum[2].count;
        const solvedHardQues=parsedData.acSubmissionNum[3].count;

        updateProgress(solvedEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedHardQues, totalHardQues, hardLabel, hardProgressCircle);

        const cardsData=[
            {label:"Overall Submission", value:parsedData.totalSubmissionNum[0].submissions},
            {label:"Overall Easy Submission", value:parsedData.totalSubmissionNum[1].submissions},
            {label:"Overall Medium Submission", value:parsedData.totalSubmissionNum[2].submissions},
            {label:"Overall Hard Submission", value:parsedData.totalSubmissionNum[3].submissions},
        ];
        console.log("Card Data is: ", cardsData);

        cardStatsContainer.innerHTML=cardsData.map(
            data=>
                `<div class="card">
                <h4>${data.label}</h4>
                <p>${data.value}</p>
                </div>`
        ).join("")
    }

    searchButton.addEventListener("click", function(){
        const username=usernameinput.value;
        console.log("The username is: ",username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
})
