import { useState } from "react";
import * as S from "./Form.style"
import { places } from "../../data/places";
import { sufganiot } from "../../data/sofganiot";

type Data = {
  place: string,
  items: { name: string, quantity: number }[]
};


function Form(): JSX.Element {
  const [data, setData] = useState<Partial<Data>>({})
  const [summery, setSummery] = useState<string>("")

  function getDate(place: string): string {
    if (place === "אלעד") return "רביעי 25/12 - נר ראשון"
    if (['בני ברק',
      'כפר חב"ד',
      'רחובות',
      'לוד',].includes(place)) return "שלישי 31/12 - נר שביעי"
    return "רביעי 1/1 - נר שמיני"
  }

  function generateSunnery() {
    console.log(data);

    const text = `משלוח ל${data.place} ביום ${getDate(data.place!)}
    ההזמנה שלי:
    ${data.items?.map(item => `${item.name} - ${item.quantity}
    `)}`
    console.log(text);

    setSummery(text)
  }

function sendMsg() {
  const urlEncodedText = encodeURIComponent(summery);
  const url = `https://wa.me/972525664230?text=${urlEncodedText}`;
  // You can now use the 'url' to open WhatsApp with the encoded message
  window.open(url, '_blank'); 
}



  return (
    <S.Container>
      {summery !== "" && <div>{summery}</div>}
      <label>עיר:</label>
      <select onChange={(e) => {
        setData({ ...data, place: e.target.value })
      }}>
        <option disabled>בחר מקום</option>
        {places.map(place =>
          <option key={place} value={place}>{place}</option>
        )}
      </select>
      {sufganiot.map(item => (
        <div key={item.name}>
          <div>{item.name}</div>
          <div>{item.description}</div>
          <label htmlFor={`quantity-${item.name}`}>כמות:</label>
          <input
            type="number"
            id={`quantity-${item.name}`}
            name={`quantity-${item.name}`}
            min="0"
            defaultValue="0"
            onChange={(e) => {
              const quantity = +e.target.value || 0;
              const isItemExist = data.items?.some(prevItem => prevItem.name === item.name);
              if (!isItemExist) setData({ ...data, items: [...(data.items || []), { name: item.name, quantity }] })
              else setData({ ...data, items: data.items?.map(prevItem => prevItem.name === item.name ? { ...prevItem, quantity } : prevItem) })
            }}
          />
        </div>
      ))}
      <button onClick={e => { e.stopPropagation(); generateSunnery() }}>צור סיכום</button>
      <button disabled={summery === ""} onClick={e => { e.stopPropagation(); sendMsg() }} >שלח הודעה</button>

    </S.Container>
  )
}

export default Form;