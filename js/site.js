var climbs = [
    {
        name: "Johnson Smith",
        route: 34,
        diff: "V5",
        flash: true,
        div: "Intermediate",
    },
    {
        name: "Sarah Holmes",
        route: 27,
        diff: "V4",
        flash: false,
        div: "Beginner",
    },
    {
        name: "Dave",
        route: 17,
        diff: "V9",
        flash: true,
        div: "Advanced",
    },
    {
        name: "Julia Barnes",
        route: 34,
        diff: "V5",
        flash: false,
        div: "Intermediate",
    },
    {
        name: "Johnson Smith",
        route: 27,
        diff: "V4",
        flash: false,
        div: "Intermediate",
    },
];

editmode = false;
sort = "name";
sortswitch = false;

function buildTable() {
    const table = document.getElementById("climbTable");
    const template = document.getElementById("tableRowTemplate");
    data = getData();

    if(sort == "name"){
        data.sort(function(a,b){
            out = a.name.localeCompare(b.name);
            if(out == 0){
                return a.route - b.route;
            }
            return out;
        });
    }
    else if(sort == "route"){
        data.sort(function (a, b) {
            out = a.route - b.route;            
            if (out == 0) {
                return a.name.localeCompare(b.name);
            }
            return out;
        });
    }
    else if(sort == "diff"){
        data.sort(function (a, b) {
            out = a.diff.localeCompare(b.diff);
            if (out == 0) {
                return a.name.localeCompare(b.name);
            }
            return out;
        });
    }
    else{
        data.sort(function (a, b) {
            let aval =
                a.div == "Beginner" ? 1 : a.div == "Intermediate" ? 2 : 3;
            let bval =
                b.div == "Beginner" ? 1 : b.div == "Intermediate" ? 2 : 3;
            out = aval - bval;
            if (out == 0) {
                return a.name.localeCompare(b.name);
            }
            return out;
        });
    }

    if(sortswitch){data.reverse();}

    table.innerHTML = "";
    for (i = 0; i < data.length; i++) {
        let climb= data[i];
        let tableRow = document.importNode(template.content, true);
        tableRow.querySelector("[data-id='name']").textContent = climb.name;
        tableRow.querySelector("[data-id='route']").textContent = climb.route.toLocaleString();
        tableRow.querySelector("[data-id='diff']").textContent = climb.diff;
        if(climb.flash){
            tableRow.querySelector("[data-id='flash']").innerHTML = "<input type='checkbox' onclick='return false;' checked/>";
        }
        else{
            tableRow.querySelector("[data-id='flash']").innerHTML = "<input type='checkbox' onclick='return false;'/>";
        }
        tableRow.querySelector("[data-id='div']").textContent = climb.div;
        tableRow.querySelector("tr").setAttribute("data-climb", climb.id);
        climbTable.appendChild(tableRow);
    }
}

function changeSort(){
    let sortSelect = document.getElementById("sortSelect");
    let selectedIndex = sortSelect.selectedIndex;
    sort = sortSelect.options[selectedIndex].value;
    buildTable();
}

function switchSort(dirbtn){
    if(sortswitch){
        dirbtn.innerHTML = "<i class='bi bi-arrow-down'></i>";
    }
    else{
        dirbtn.innerHTML = "<i class='bi bi-arrow-up'></i>";
    }
    sortswitch = !sortswitch;
    buildTable();
}

function getData() {
    let data = localStorage.getItem("es-climbdata");

    if (data == null) {
        let idData = climbs.map((climb) => {
            climb.id = generateId();
            return climb;
        });

        localStorage.setItem("es-climbdata", JSON.stringify(idData));
        data = localStorage.getItem("es-climbdata");
    }

    let newData = JSON.parse(data);
    return newData;
}

function saveData() {
    let name = document.getElementById("ename").value;
    let route = parseInt(document.getElementById("eroute").value);

    let diffSelect = document.getElementById("ediff");
    let selectedIndex = diffSelect.selectedIndex;
    let diff = diffSelect.options[selectedIndex].text;

    let flash = document.getElementById("eflash").checked;

    let divSelect = document.getElementById("ediv");
    selectedIndex = divSelect.selectedIndex;
    let div = divSelect.options[selectedIndex].text;

    let newdata = {
        name: name,
        route: route,
        diff: diff,
        flash: flash,
        div: div,
        id: generateId(),
    };

    let data = getData();
    data.push(newdata);

    localStorage.setItem("es-climbdata", JSON.stringify(data));
    clearForm();
    buildTable();
}

function clearForm(){
    document.getElementById("addDataForm").reset();
}

function generateId() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}

function editData(ebutton) {
    let tableRow = ebutton.parentElement.parentElement;

    let nameData = tableRow.querySelector("[data-id='name']");
    let name = nameData.textContent;
    nameData.innerHTML = "<input type='text' id='editname' value='" + name + "' class=form-control>";

    let routeData = tableRow.querySelector("[data-id='route']");
    let route = routeData.textContent;
    routeData.innerHTML = "<input type='number' id='editroute' value='" + route + "' class=form-control>";

    const diffTemplate = document.getElementById("diffSelectTemplate");
    let diffNode = document.importNode(diffTemplate.content, true);
    console.log(diffNode)
    let diffData = tableRow.querySelector("[data-id='diff']");
    let selector = document.getElementById("ediff");
    diffNode.querySelector("select").selectedIndex = [...selector.options,].findIndex(
        option => option.text == diffData.textContent
    );
    diffData.innerHTML = "";
    diffData.appendChild(diffNode);

    let checkbox = tableRow.querySelector("[data-id='flash']").querySelector("input");
    checkbox.removeAttribute("onclick");
    let parent = checkbox.parentNode;
    let wrapper = document.createElement("div");
    wrapper.classList.add("form-control")
    parent.replaceChild(wrapper, checkbox);
    wrapper.appendChild(checkbox);

    const divTemplate = document.getElementById("divSelectTemplate");
    let divNode = document.importNode(divTemplate.content, true);
    let divData = tableRow.querySelector("[data-id='div']");
    selector = document.getElementById("ediv");
    divNode.querySelector("select").selectedIndex = [...selector.options].findIndex(
        (option) => option.text == divData.textContent
    );
    divData.innerHTML = "";
    divData.appendChild(divNode);

    tableRow.querySelector("[data-id='options']").innerHTML =
        "<button class='btn btn-secondary  mx-2' onclick='buildTable()'>Cancel</button><button class='btn btn-primary' onclick='updateData(this)'>Save</button>";
}

function deleteData(dbutton) {
    let tableRow = dbutton.parentElement.parentElement;
    let dataId = tableRow.getAttribute("data-climb");
    let data = getData();
    data = data.filter((climb) => climb.id != dataId);
    localStorage.setItem("es-climbdata", JSON.stringify(data));
    buildTable();
}

function updateData(sbutton) {
    let tableRow = sbutton.parentElement.parentElement;
    let dataId = tableRow.getAttribute("data-climb");
    data = getData();
    let dataindex = data.findIndex(climb => climb.id == dataId);

    let name = tableRow
        .querySelector("[data-id='name']")
        .querySelector("input").value;

    let route = parseInt(
        tableRow
            .querySelector("[data-id='route']")
            .querySelector("input").value
    );

    let diffSelect = tableRow
        .querySelector("[data-id='diff']")
        .querySelector("select");
    let selectedIndex = diffSelect.selectedIndex;
    let diff = diffSelect.options[selectedIndex].text;

    let flash = document
        .querySelector("[data-id='flash']")
        .querySelector("input").checked;


    let divSelect = tableRow
        .querySelector("[data-id='div']")
        .querySelector("select");
    selectedIndex = divSelect.selectedIndex;
    let div = divSelect.options[selectedIndex].text;

    let newdata = {
        name: name,
        route: route,
        diff: diff,
        flash: flash,
        div: div,
        id: dataId,
    };

    data[dataindex] = newdata;
    localStorage.setItem("es-climbdata", JSON.stringify(data));
    buildTable();
}
