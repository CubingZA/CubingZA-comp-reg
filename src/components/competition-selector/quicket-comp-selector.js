import React, { useState } from 'react';
import { getEvents } from '../../services/quicket';
import './comp-selector.less';

function populateCompetitions(setComps, setError) {
  getEvents()
  .then(res => {
    let comps = res.data.results.map(comp => {return {
      id: comp.id,
      name: comp.name,
    }});
    sortByName(comps);
    setComps({
      selected: comps.length > 0 ? comps[0]: {id: null, name: ""},
      list: comps,
    });
    setError("");
  })
  .catch(err => {
    if (err.response && err.response.status === 401) {
      setError("Unauthorized. Quicket key and/or token may be invalid.");
    } else {
      setError(err.message);
    }
  })
}

export default function QuicketCompSelector({comps, setComps, clearData}) {

  const [err, setError] = useState("");

  if (comps.list.length === 0) {
    populateCompetitions(setComps, setError)
  };

  function selectComp(index) {
    setComps({
      selected: comps.list[index],
      list: comps.list
    });
    clearData();
  }

  return <div>
    <div>{err ? 
      <span className='comp-selector-error'><strong>Error:</strong> {err} </span>
    : 
      <label>
        Quicket event:
        <select onChange={event => selectComp(event.target.selectedIndex)}>
          {comps.list.map(comp => <option key={comp.id} value={comp.id}>{comp.name}</option>)}
        </select>
      </label>
    }</div>
  </div>
}

function sortByName(list) {
  list.sort((a,b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}