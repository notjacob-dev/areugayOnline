var creds = {
    "apiKey": "AIzaSyC_tjKPJg-9WGLBJ8d32nTP5VNx2TolmO4",
    "authDomain": "areugay-0.firebaseapp.com",
    "projectId": "areugay-0",
}
firebase.initializeApp(creds)
var db = firebase.firestore()
console.log(new URLSearchParams(window.location.search).get("uuid"))
db.collection("summaries").where("uuid", "==", new URLSearchParams(window.location.search).get("uuid")).get().then(d => {
    console.log(d)
    if (d.size > 0) {
        const data = d.docs[0]
        document.getElementById("header").innerText = "areugay summary"
        document.getElementById("name").innerText = "Name: " + data.get("name")
        document.getElementById("gay").innerText = "Gay: " + data.get("gay")
        document.getElementById("percent").innerText = "Percent: " + data.get("percent") + "%"
        document.getElementById("timestamp").innerText = "Taken on " + data.get("age").toDate().toDateString()
    } else {
        window.location.href = base_url + "/404"
    }
})