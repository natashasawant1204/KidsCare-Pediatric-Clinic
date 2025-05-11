import { db } from './firebaseConfig.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const appointmentsList = document.getElementById('appointmentsList');
const vaccinationsList = document.getElementById('vaccinationsList');

async function loadAppointments() {
    appointmentsList.innerHTML = '';
    try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        querySnapshot.forEach((doc) => {
            const apt = doc.data();
            appointmentsList.innerHTML += `
                <tr>
                    <td>${apt.date}<br>${apt.time}</td>
                    <td>${apt.childName}</td>
                    <td>${apt.age || ''}</td>
                    <td>${apt.doctor}</td>
                    <td>${apt.parentContact || ''}</td>
                    <td>${apt.reason || ''}</td>
                    <td><span class="badge bg-${apt.status === 'Confirmed' ? 'success' : 'warning'}">${apt.status || ''}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="sendReminder('${doc.id}', 'appointment')">
                            <i class="fas fa-bell"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="editRecord('${doc.id}', 'appointment')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="cancelRecord('${doc.id}', 'appointment')">
                            <i class="fas fa-times"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading appointments:", error);
        appointmentsList.innerHTML = '<tr><td colspan="8" class="text-center">Failed to load appointments.</td></tr>';
    }
}

async function loadVaccinations() {
    vaccinationsList.innerHTML = '';
    try {
        const querySnapshot = await getDocs(collection(db, "vaccination"));
        querySnapshot.forEach((doc) => {
            const vac = doc.data();
            vaccinationsList.innerHTML += `
                <tr>
                    <td>${vac.date || ''}<br>${vac.time || ''}</td>
                    <td>${vac.childName}</td>
                    <td>${vac.parentName || ''}</td>
                    <td>${vac.email || ''}</td>
                    <td>${vac.phone || ''}</td>
                    <td>${vac.vaccine || ''}</td>
                    <td><span class="badge bg-${vac.status === 'Completed' ? 'success' : 'info'}">${vac.status || ''}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="sendReminder('${doc.id}', 'vaccination')">
                            <i class="fas fa-bell"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="editRecord('${doc.id}', 'vaccination')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="cancelRecord('${doc.id}', 'vaccination')">
                            <i class="fas fa-times"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error loading vaccinations:", error);
        vaccinationsList.innerHTML = '<tr><td colspan="8" class="text-center">Failed to load vaccinations.</td></tr>';
    }
}

function sendReminder(id, type) {
    const reminderModal = new bootstrap.Modal(document.getElementById('reminderModal'));
    const reminderMessageTextarea = document.getElementById('reminderMessage');

    // Fetch the record data from Firestore
    const collectionName = type === 'appointment' ? 'appointments' : 'vaccination';
    getDoc(doc(db, collectionName, id)).then(docSnap => {
        if (docSnap.exists()) {
            const record = docSnap.data();
            // Prepare the reminder message
            let message = reminderMessageTextarea.value;
            message = message.replace('[Parent]', record.parentName || record.parentContact || 'Parent')
                             .replace('[Child]', record.childName || '')
                             .replace('[Type]', type === 'appointment' ? 'appointment' : 'vaccination')
                             .replace('[Doctor]', type === 'appointment' ? (record.doctor || '') : 'vaccination schedule')
                             .replace('[Time]', `${record.time || ''} on ${record.date || ''}`);

            reminderMessageTextarea.value = message;
            reminderModal.show();
        } else {
            alert('Record not found for sending reminder.');
        }
    }).catch(error => {
        console.error('Error fetching record for reminder:', error);
        alert('Failed to fetch record for reminder.');
    });
}

function editRecord(id, type) {
    alert(`Edit ${type} with ID ${id} functionality is not implemented yet.`);
}

function cancelRecord(id, type) {
    alert(`Cancel ${type} with ID ${id} functionality is not implemented yet.`);
}

document.addEventListener('DOMContentLoaded', () => {
    loadAppointments();
    loadVaccinations();
    loadNewborns();

    // Optionally, refresh data every 30 seconds
    setInterval(() => {
        loadAppointments();
        loadVaccinations();
        loadNewborns();
    }, 30000);
});

function loadNewborns() {
    const newbornsContainer = document.querySelector('.newborns-grid');
    if (!newbornsContainer) return;
    newbornsContainer.innerHTML = '';
    try {
        const newborns = JSON.parse(localStorage.getItem('newborns') || '[]');
        if (newborns.length === 0) {
            newbornsContainer.innerHTML = '<p class="text-center">No newborn records found.</p>';
            return;
        }
        newborns.forEach(newborn => {
            newbornsContainer.innerHTML += `
                <div class="newborn-card">
                    <div class="newborn-header">
                        <h3>${newborn.name}</h3>
                        <span class="badge bg-info">${calculateAge(newborn.dateOfBirth)}</span>
                    </div>
                    <div class="newborn-details">
                        <p><i class="fas fa-birthday-cake"></i> ${new Date(newborn.dateOfBirth).toLocaleDateString()}</p>
                        <p><i class="fas fa-venus-mars"></i> ${newborn.gender}</p>
                        <p><i class="fas fa-tint"></i> ${newborn.bloodGroup || 'Not specified'}</p>
                        <p><i class="fas fa-weight"></i> ${newborn.weight}kg</p>
                        <p><i class="fas fa-user"></i> ${newborn.parentName}</p>
                        <p><i class="fas fa-phone"></i> ${newborn.contactNumber}</p>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error loading newborns:", error);
        newbornsContainer.innerHTML = '<p class="text-center text-danger">Failed to load newborn records.</p>';
    }
}

function calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const monthsDiff = (today.getFullYear() - birthDate.getFullYear()) * 12 +
        (today.getMonth() - birthDate.getMonth());

    if (monthsDiff < 1) {
        const daysDiff = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
        return `${daysDiff} days old`;
    } else if (monthsDiff < 12) {
        return `${monthsDiff} months old`;
    } else {
        const years = Math.floor(monthsDiff / 12);
        return `${years} year${years > 1 ? 's' : ''} old`;
    }
}

function addNewborn() {
    const newbornForm = document.getElementById('newbornForm');
    if (newbornForm) {
        newbornForm.reset();
    }
    const newbornModal = new bootstrap.Modal(document.getElementById('newbornModal'));
    newbornModal.show();
}

window.addNewborn = addNewborn;

function saveNewbornRecord() {
    const form = document.getElementById('newbornForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = {
        id: Date.now(),
        name: document.getElementById('newbornName').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value,
        bloodGroup: document.getElementById('bloodGroup').value,
        weight: parseFloat(document.getElementById('weight').value) || 0,
        medicalNotes: document.getElementById('medicalNotes').value,
        parentName: document.getElementById('parentName').value,
        contactNumber: document.getElementById('contactNumber').value,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };

    try {
        let newborns = JSON.parse(localStorage.getItem('newborns') || '[]');
        newborns.push(formData);
        localStorage.setItem('newborns', JSON.stringify(newborns));
        alert("Newborn record saved successfully.");
        const newbornModal = bootstrap.Modal.getInstance(document.getElementById('newbornModal'));
        newbornModal.hide();
        loadNewborns();
    } catch (error) {
        console.error("Error saving newborn record:", error);
        alert("Failed to save newborn record. Please try again.");
    }
}

window.saveNewbornRecord = saveNewbornRecord;
