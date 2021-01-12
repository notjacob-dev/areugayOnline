const percents = new Map([
    ["a", 20],
    ["b", 38],
    ["c", 67],
    ["d", 89],
    ["e", 50],
    ["f", 12],
    ["g", 78],
    ["h", 4],
    ["i", 10],
    ["j", 0],
    ["k", 18],
    ["l", 62],
    ["m", 78],
    ["n", 32],
    ["o", 40],
    ["p", 2],
    ["q", 22],
    ["r", 31],
    ["s", 69],
    ["t", 43],
    ["u", 54],
    ["v", 14],
    ["w", 86],
    ["x", 78],
    ["y", 10],
    ["z", 60]
])

let phase = 0
let uname = ""
let age = 0
let color = ""
const progress = () => {
    if (phase == 0) {
        uname = document.getElementById("text").value
        document.getElementById("query").innerText = "What is your age?"
        document.getElementById("text").placeholder = "age"
    } else if (phase == 1) {
        age = document.getElementById("text").value
        document.getElementById("query").innerText = "What is your favorite color?"
        document.getElementById("text").placeholder = "color"
    } else if (phase == 2) {
        color = document.getElementById("text").value
        document.getElementById("submit").disabled = true
        document.getElementById("text").placeholder = ""
        document.getElementById("query").innerText = "Calculating..."
        
        const newstr = (uname + color).toLowerCase().split('')
        const percent = newstr.map(c => percents.get(c))
        let acc = 0
        percent.forEach(num => {
            acc += num
        })
        const fin = acc / percent.length
        window.location.href = "http://localhost:3000/create-summary?" +
        "gay=" + (fin > 50 ? "true" : "false") + "&" +
        "percent=" + fin + "&" + 
        "name=" + uname
    } else {
        document.getElementById("query").innerText = "How tf are you still here"
    }
    document.getElementById("text").value = ""
    phase++
}