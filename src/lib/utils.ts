export function makeCode(){ return String(Math.floor(100000+Math.random()*900000)); }
export function money(value:string|number,currency:string){return new Intl.NumberFormat(currency==="BRL"?"pt-BR":"es-BO",{style:"currency",currency}).format(Number(value));}
export function phoneLink(number:string,text:string){return `https://wa.me/${number.replace(/\D/g,"")}?text=${encodeURIComponent(text)}`;}