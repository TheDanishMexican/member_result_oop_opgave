"use strict";

import * as member from "./data/member.js"
import * as result from "./data/result.js"
import * as tabs from './tabs.js'


window.addEventListener("load", initApp);

const results = [];
const members = [];
const dateOptions = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'long' };
const disciplineTranslations = {
    'breaststroke': 'brystsvømning',
    'freestyle': 'crawl',
    'backstroke': 'rygsvømning',
    'butterfly': 'butterfly'
};
const resultTypeTranslations = {
    'training': 'træning',
    'competition': 'stævne'
};

async function initApp() {
  tabs.initTabs();
  await buildMembersList();
  await buildResultsList();
  displayMembers(members);
  displayResults(results);

}

async function fetchResultData() {
  const response = await fetch('data/results.json');
  const data = await response.json();

  return data;
}

async function fetchMemberData() {
  const response = await fetch('data/members.json');
  const data = await response.json();

  return data;
}

async function buildMembersList() {
  const originalList = await fetchMemberData();

  for (const obj of originalList) {
    const newObj = member.constructMember(obj)
  
    members.push(newObj);
  }
}

async function buildResultsList() {
  const originalList = await fetchResultData();
  const resultsWithNames = await matchIdWithName(); 

  for (const obj of originalList) {
    const newObj = result.constructResult(obj);

    const matchingName = resultsWithNames.find(result => result.memberId === newObj.memberId);

    if (matchingName.name) {
      newObj.name = matchingName.name;
    } else {
      newObj.name = "Not a member"; 
    }

    results.push(newObj);
  }

  results.sort((a, b) => a.time - b.time);
}


function displayMembers(members) {
  const table = document.querySelector("#membersTbody");
  table.innerHTML = "";
  for(const member of members) {
    const html = /*html*/`
    <tr>
      <td>${member.name}</td>
      <td>${member.active}</td>
      <td>${member.birthday.toLocaleDateString()}</td>
      <td>${member.age}</td>
      <td>${member.juniorOrSenior}</td>
    </tr>`;

    table.insertAdjacentHTML("beforeend", html);
  }
}

function displayResults(results) {
    const table = document.querySelector("#resultsTbody");
    table.innerHTML = '';

    for(const result of results) {
        const translatedDiscipline = disciplineTranslations[result.discipline];
        const translatedResultType = resultTypeTranslations[result.resultType];
        const formattedDate = new Date(result.date).toLocaleDateString('da-DK', dateOptions);
        const formattedTime = milliSecToTime(result.time)

        const html = /*html*/ `
            <tr>
            <td>${formattedDate}</td>
            <td>${result.name}</td>
            <td>${translatedDiscipline}</td>
            <td>${translatedResultType}</td>
            <td>${formattedTime}</td>
            </tr>`;

            table.insertAdjacentHTML('beforeend', html);
    }
}

function milliSecToTime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const hundredths = Math.floor((milliseconds % 1000) / 10);

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;

  return formattedTime;
}

async function matchIdWithName() {
  const members = await fetchMemberData();
  const results = await fetchResultData();

  const memberObj = {}; 
  const resultsWithNames = [];

  members.forEach(member => {
    const fullName = `${member.firstName} ${member.lastName}`;
    memberObj[member.id] = fullName; 
  });

  results.forEach(result => {
    const fullName = memberObj[result.memberId]; 
    const resultWithFullName = { id: result.id, memberId: result.memberId, name: fullName };
    resultsWithNames.push(resultWithFullName);
  });

  return resultsWithNames;
}






