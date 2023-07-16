const template = document.createElement('template');
template.innerHTML = /*html*/`
<style>
fieldset {
  // width: 360px;
}

input {
  font-size: 18px;
  // padding: 5px;
  // width: 350px;
}
datalist {
  // width: 350px;
  // padding: 5px;
  max-height: 10rem;
  overflow: scroll;
  positon: absolute;
  z-index: 9000;
  background: lightgray;
  positon: absolute;
  border: 1px solid grey;
  box-sizing: border-box;
}

option {
  padding: 4px;
  margin-bottom: 1px;
   font-size: 18px;
  cursor: pointer;
}

.active{
  background-color: lightblue;
}
</style>
<fieldset>

  <input  autocomplete="off" role="combobox" list="" id="input" name="browsers" placeholder="Select your fav browser">
  <!-- Its important that you keep list attribute empty to hide the default dropdown icon and the browser's default datalist -->

  <datalist id="browsers" role="listbox">
    <slot></slot>
  </datalist>
</fieldset>
`

export class Droplist extends HTMLElement {

  
  constructor() {
    super();
    this.currentFocus = -1

    this.reactToMouseOver = true
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));

    const input =  this.shadowRoot.getElementById("input")
    const browsers =  this.shadowRoot.getElementById("browsers")
    // console.log(browsers.getElementsByTagName('slot'))

    input.onfocus = function () {
      browsers.style.display = 'block';
      browsers.style.position = 'absolute';
      const width = input.getBoundingClientRect().width
      console.log({width})
      browsers.style.width = width + 'px';
      browsers.style.zIndex = '9000';

      input.style.borderRadius = "5px 5px 0 0";  
    };
    for (let option of browsers.options) {
      option.onclick = function () {
        input.value = option.value;
        browsers.style.display = 'none';
        input.style.borderRadius = "5px";
      }
    };
    input.onblur = () => {
      browsers.style.display = 'none';
    }
    console.log(input)
    
    input.oninput = () => {
      this.currentFocus = -1;
      var text = input.value.toUpperCase();
      for (let option of browsers.options) {
        if(option.value.toUpperCase().indexOf(text) > -1){
          option.style.display = "block";
      }else{
        option.style.display = "none";
        }
      };
    }
    this.currentFocus = -1;

    input.onkeydown = (e) => {
      const visibleOptions = Array.from(browsers.options).filter(x => x.style.display !== 'none')

      // console.log({visibleOptions})
      if(e.keyCode == 40){
        this.currentFocus++
       this.addActive(visibleOptions);
      }
      else if(e.keyCode == 38){
        this.currentFocus--

       this.addActive(visibleOptions);
      }
      else if (e.keyCode == 27) {
        browsers.style.display = 'none';
        input.blur()

      }
      else if(e.keyCode == 13){
        e.preventDefault();
        if (this.currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (browsers.options) browsers.options[this.currentFocus].click();
        }
      }

      this.reactToMouseOver = false
      setTimeout(() => { this.reactToMouseOver = true }, 1000)
    }
  }
    
  addActive(x) {

    if (!x) return false;
    if (this.currentFocus >= x.length) {
      this.currentFocus = x.length - 1
    }
    if (this.currentFocus < 0) {
      this.currentFocus = 0
    }
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("active");
    }
    x[this.currentFocus].classList.add("active");

    const parent = x[this.currentFocus].parentElement
    const item = x[this.currentFocus]
    const parentHeight = parent.clientHeight
    const itemHeight = item.clientHeight
    const parentScroll = parent.scrollTop
    const containerTop = parent.getBoundingClientRect().top
    const itemTop = item.getBoundingClientRect().top
    const offset = itemTop - containerTop + parentScroll;

    if (offset > parentHeight + parentScroll - itemHeight) {
      parent.scrollTo({ behavior: "smooth", top: offset - parentHeight + itemHeight + itemHeight})
      console.log("scrolled down")
    }

    if (offset < parentScroll) {
      parent.scrollTo({ behavior: "smooth", top: offset })
      console.log("scrolled up")
    }
    const currentFocus = this.currentFocus
    console.log("offset", { offset,containerTop, itemTop, parentScroll, currentFocus, parentHeight,  })
  }

  connectedCallback() {
    let slots = this.shadowRoot.querySelectorAll('slot');
    const browsers =  this.shadowRoot.getElementById("browsers")

    slots[0].addEventListener('slotchange', (e) => {
        let nodes = slots[0].assignedNodes()
        for (const i in nodes)  {
          browsers.appendChild(nodes[i])
        }
        
        const visibleOptions = Array.from(browsers.options).filter(x => x.style.display !== 'none')

        for (const optionId in visibleOptions) {
          const option = visibleOptions[optionId]
          option.addEventListener('mouseover', () => {
            if (!this.reactToMouseOver) return
            this.currentFocus = optionId
            this.addActive(visibleOptions);
          })
        }

        console.log({visibleOptions})
    });
  }
}

customElements.define('ce-droplist', Droplist)
