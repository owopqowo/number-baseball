const inputs = document.querySelectorAll('input[type=number]');
const btn = document.querySelector('.btn');
const items = document.querySelector('.items');
const randomNumberOfDigits = 3;
let randomNumberArr = [];
let duplicationResult = false;
let count = 10;
let inputValueArr = [];
let result = {
  strike: 0,
  ball: 0,
  out: 0,
}

function resetGame() {
  duplicationResult = false;
  count = 10;
  inputValueArr = [];
  inputs.forEach((input) => {
    input.value = '';
  });
  items.innerHTML = '';
  result = {
    strike: 0,
    ball: 0,
    out: 0,
  }
  randomNumberArr = [];
  randomNumber(randomNumberArr, randomNumberOfDigits);
}

function randomNumber(array, num) {
  let newNumber;
  for (let i = 0; i < num; i++) {
    newNumber = Math.floor(Math.random()*10);
    array.indexOf(newNumber) > -1 ? i-- : array.push(newNumber);
  }
}

function duplicationCheck(array) {
  const setArray = new Set(array);
  setArray.size !== array.length ? duplicationResult = true : duplicationResult = false;
  return duplicationResult;
}

function matchArr(array1, array2) {
  array2.forEach((value) => {
    if (array1.indexOf(value) > -1) {
      if(array2[array1.indexOf(value)] === array1[array1.indexOf(value)]) {
        result.strike++;
      } else {
        result.ball++;
      }
    } else {
      result.out++;
    }
  })
}

function creatItem(value, result) {
  const item = document.createElement('li');
  item.innerHTML =  `
    <li class="item">
      <div class="number">${value}</div>
      <div class="result">${result}</div>
    </li>
  `;
  return items.append(item);
}

randomNumber(randomNumberArr, randomNumberOfDigits);

inputs.forEach((input) => {
  input.addEventListener('input', () => {
    if (input.value.length) input.value = input.value.slice(0, input.maxLength);
  });
})

btn.addEventListener('click', () => {
  if (!count) {
    const confirmCheck = confirm('기회를 모두 소진하였습니다. \n재시작하시겠습니까?');
    if (confirmCheck) return resetGame();
    return false;
  }

  inputValueArr = [];
  inputs.forEach((input) => {
    inputValueArr.push(input.value === '' ? input.value : Number(input.value));
  })
  console.log(inputValueArr);
  if(inputValueArr.indexOf('') > -1) return alert('숫자를 채워주세요');

  duplicationCheck(inputValueArr);
  if(duplicationResult) return alert('중복된 숫자를 제거해주세요');

  result = {
    strike: 0,
    ball: 0,
    out: 0,
  }  
  matchArr(randomNumberArr, inputValueArr);

  creatItem(inputValueArr, `${result.strike} STRIKE / ${result.ball} BALL / ${result.out} OUT`);
  count--;

  if(result.strike === randomNumberOfDigits) {
    alert('모든 숫자를 맞히는데 성공했어요!');
    resetGame();
  }
})