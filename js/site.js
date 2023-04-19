function displayMessage() {
    let msg = document.getElementById("message").value;
    //alert(msg);
    Swal.fire(
        {
            backdrop: false,
            title: 'APP NAME',
            text: msg
        }
    );
}
