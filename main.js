const inputSlider=document.querySelector("[data-length-slider]");
const lengthDisplay= document.querySelector("[data-length]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn= document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck= document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase"); 
const numbersCheck= document.querySelector("#numbers");
const symbolCheck= document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateButton= document.querySelector(".generateButton"); 
const allCheckBox= document.querySelectorAll("input[type=checkbox]");

// Generate Random Letters and Number and Symbols
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;

handleSlider();


function handleSlider(){

    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

}

function setIndicator(color)
{
    indicator.computedStyleMap.backgroundColor=color;
    //shadow
}

function getRndInteger(min,max){
    
    return Math.floor(Math.random() * (max - min)) + min; 


}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNUM = getRndInteger(0,symbol.length);
    return symbol.charAt(randNUM);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercase.checked) hasUpper = true;
    if (lowercase.checked) hasLower = true;
    if (numbers.checked) hasNumber = true;
    if (symbols.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() 
{
   try { 
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText="copied";
    
   } catch (error) {
    copyMsg.innerText="Failed";
    
   }
   // to make span visible 

   copyMsg.classList.add("active");

   setTimeout( ()=>{
    copyMsg.classList.remove("active")

   },2000);

}

function handleCheckBoxCahnge(){
    checkCount=0;
    allCheckBox.forEach( (checkbox)=>{
    if(checkbox.checked)
        checkCount++;
    });
   

    //special condition

    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }

}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxCahnge);
}  
    )

inputSlider.addEventListener('input', (e)=>{
    passwordLength=e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
    copyContent();
}
})


// shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
// Shuffle the array randomly - Fisher Yates Method
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateButton.addEventListener('click',()=>
{
    //none of the checkbox are selected  
    if(checkCount<=0) return;

    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }

    //lets start the jorney to find new password 

    //remove old password

    password="";

    // let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password+=generateSymbol();
    // }

    let funArr=[];

    if (uppercaseCheck.checked)
      funArr.push(generateUpperCase)

    if (lowercaseCheck.checked)
      funArr.push(generateLowerCase)

    if (numbersCheck.checked)
      funArr.push(generateRandomNumber) 
    
    if (symbolCheck.checked)
      funArr.push(generateSymbol)

      //cumpulsory addition 
      for(let i=0;i<funArr.length;i++)
      {
        password+=funArr[i]();
      }

      //remaining addition
      for(let i=0;i<passwordLength-funArr.length;i++)
      {
        let randIndex=getRndInteger(0, funArr.length); 
        password+=funArr[randIndex]();
      }

      // shufle the password 
      password=shufflePassword(Array.from(password));

      // show in UI

      passwordDisplay.value=password; 
      //Calculate strength
      calcStrength();
    


})