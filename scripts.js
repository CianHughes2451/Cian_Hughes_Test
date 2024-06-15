let currentAction = '';
let currentMode = '';
let currentDefinition = '';
let currentPlayer = '';
let secondPlayer = '';
let actionsLog = [];

let team1Goals = 0;
let team1Points = 0;
let team2Goals = 0;
let team2Points = 0;

let playerNames = {
    1: 'Player 1',
    2: 'Player 2',
    3: 'Player 3',
    4: 'Player 4',
    5: 'Player 5',
    6: 'Player 6',
    7: 'Player 7',
    8: 'Player 8',
    9: 'Player 9',
    10: 'Player 10',
    11: 'Player 11',
    12: 'Player 12',
    13: 'Player 13',
    14: 'Player 14',
    15: 'Player 15'
};

let coordinatesEnabled = false;

let currentCoordinates1 = '';
let currentCoordinates2 = '';

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('action-buttons').classList.add('active');
    updateCounters();
    updatePlayerLabels(); // Ensure player labels are updated on page load
});

function selectAction(action) {
    currentAction = action;
    currentCoordinates1 = '';
    const actionScreenMap = {
        'Point - Score': 'mode-point-score',
        'Point - Miss': 'mode-point-miss',
        'Goal - Score': 'mode-goal-score',
        'Goal - Miss': 'mode-goal-miss',
        'Free Won': 'mode-free-won',
        'Ball - Won': 'mode-ball-won',
        'Ball - Lost': 'mode-ball-lost',
        'Goal - Against': 'mode-goal-against',
        'Point - Against': 'mode-point-against',
        'Miss - Against': 'mode-miss-against',
        'Kickout': 'mode-kickout',
        'Shot - Saved': 'mode-shot-saved',
        'Foul': 'mode-foul',
        'Carry': 'mode-carry'
    };

    if (actionScreenMap[action]) {
        switchScreen(actionScreenMap[action]);
    } else if (action === 'Handpass' || action === 'Kickpass') {
        switchScreen('player-buttons');
    } else {
        switchScreen('player-buttons');
    }
}

function selectMode(mode) {
    currentMode = mode;
    const actionDefinitionMap = {
        'Point - Miss': 'definition-point-miss',
        'Goal - Miss': 'definition-goal-miss',
        'Kickout': 'definition-kickout',
        'Ball - Won': 'definition-ball-won',
        'Ball - Lost': 'definition-ball-lost'
    };

    if (currentAction === 'Point - Against' || currentAction === 'Goal - Against') {
        if (mode === 'Mistake') {
            if (coordinatesEnabled) {
                switchScreen('coordinate-screen'); // Go to coordinate screen for Mistake
            } else {
                switchScreen('player-buttons');
            }
        } else {
            if (coordinatesEnabled) {
                switchScreen('coordinate-screen'); // Go to coordinate screen for No Mistake
            } else {
                logAction(); // Log action directly for No Mistake
            }
        }
    } else if (currentAction === 'Miss - Against') {
        if (coordinatesEnabled) {
            switchScreen('coordinate-screen'); // Go to coordinate screen for Miss - Against
        } else {
            logAction(); // Log action directly for Miss - Against
        }
    } else if (coordinatesEnabled && (currentAction === 'Point - Score' || currentAction === 'Goal - Score' || currentAction === 'Ball - Won' || currentAction === 'Ball - Lost' || currentAction === 'Kickout' || currentAction === 'Free Won')) {
        switchScreen('coordinate-screen'); // Go to coordinate screen for specified actions
    } else if (actionDefinitionMap[currentAction]) {
        switchScreen(actionDefinitionMap[currentAction]);
    } else {
        switchScreen('player-buttons');
    }
}

function selectDefinition(definition) {
    currentDefinition = definition;

    if (coordinatesEnabled && (currentAction === 'Point - Miss' || currentAction === 'Goal - Miss' || currentAction === 'Ball - Won' || currentAction === 'Ball - Lost' || currentAction === 'Kickout')) {
        switchScreen('coordinate-screen'); // Go to coordinate screen for specified actions after definition screen
    } else {
        switchScreen('player-buttons');
    }
}

function selectPlayer(player) {
    currentPlayer = player;
    if (currentAction === 'Handpass' || currentAction === 'Kickpass') {
        switchScreen('player-buttons-second');
    } else {
        logAction();
    }
}

function selectSecondPlayer(player) {
    secondPlayer = player;
    logAction();
}

function logAction() {
    const entry = {
        action: currentAction,
        mode: currentMode,
        definition: currentDefinition,
        player: playerNames[currentPlayer] || currentPlayer,
        player2: playerNames[secondPlayer] || secondPlayer || '',
        coordinates1: currentCoordinates1 || '',
        coordinates2: currentCoordinates2 || ''
    };

    actionsLog.push(entry);
    updateSummary();

    if (currentAction === 'Point - Score') {
        team1Points++;
    } else if (currentAction === 'Goal - Score') {
        team1Goals++;
    } else if (currentAction === 'Point - Against') {
        team2Points++;
    } else if (currentAction === 'Goal - Against') {
        team2Goals++;
    }

    updateCounters();
    resetSelection();
    switchScreen('action-buttons'); // Ensure to return to Stats screen
}

function logPointAgainst() {
    const entry = {
        action: currentAction,
        mode: currentMode,
        definition: currentDefinition,
        player: currentMode === 'Mistake' ? (playerNames[currentPlayer] || currentPlayer) : '', // Log player if Mistake
        player2: '',
        coordinates1: currentCoordinates1 || '',
        coordinates2: currentCoordinates2 || ''
    };
    actionsLog.push(entry);
    updateSummary();
    team2Points++;
    updateCounters();
    resetSelection();
    switchScreen('action-buttons'); // Return to Stats screen
}

function logGoalAgainst() {
    const entry = {
        action: currentAction,
        mode: currentMode,
        definition: currentDefinition,
        player: currentMode === 'Mistake' ? (playerNames[currentPlayer] || currentPlayer) : '', // Log player if Mistake
        player2: '',
        coordinates1: currentCoordinates1 || '',
        coordinates2: currentCoordinates2 || ''
    };
    actionsLog.push(entry);
    updateSummary();
    team2Goals++;
    updateCounters();
    resetSelection();
    switchScreen('action-buttons'); // Return to Stats screen
}

function logMissAgainst() {
    const entry = {
        action: currentAction,
        mode: currentMode,
        definition: currentDefinition,
        player: '', // Leave player column clear
        player2: ''
    };
    actionsLog.push(entry);
    updateSummary();
    updateCounters();
    resetSelection();
    switchScreen('action-buttons');
}

function returnToActionScreen() {
    resetSelection();
    switchScreen('action-buttons');
}

function returnToFirstPlayerScreen() {
    switchScreen('player-buttons');
}

function returnToModeScreen() {
    const actionModeMap = {
        'Point - Miss': 'mode-point-miss',
        'Goal - Miss': 'mode-goal-miss',
        'Free Won': 'mode-free-won',
        'Ball - Won': 'mode-ball-won',
        'Ball - Lost': 'mode-ball-lost',
        'Goal - Against': 'mode-goal-against',
        'Point - Against': 'mode-point-against',
        'Miss - Against': 'mode-miss-against',
        'Kickout': 'mode-kickout',
        'Shot - Saved': 'mode-shot-saved'
    };

    if (actionModeMap[currentAction]) {
        switchScreen(actionModeMap[currentAction]);
    } else {
        switchScreen('action-buttons');
    }
}

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        if (screenId === 'coordinate-screen') {
            drawPitch(); // Ensure the pitch is drawn when entering the coordinate screen
        }
    } else {
        console.error(`Screen with ID ${screenId} not found.`);
    }
}

function updateSummary() {
    const summaryTableBody = document.getElementById('summary-table').querySelector('tbody');
    summaryTableBody.innerHTML = '';

    actionsLog.forEach((entry, index) => {
        const row = document.createElement('tr');

        const actionCell = document.createElement('td');
        const modeCell = document.createElement('td');
        const definitionCell = document.createElement('td');
        const playerCell = document.createElement('td');
        const player2Cell = document.createElement('td');
        const x1Cell = document.createElement('td'); // New cell for X_1
        const y1Cell = document.createElement('td'); // New cell for Y_1
        const x2Cell = document.createElement('td'); // New cell for X_2
        const y2Cell = document.createElement('td'); // New cell for Y_2

        actionCell.textContent = entry.action;
        modeCell.textContent = entry.mode;
        definitionCell.textContent = entry.definition;
        playerCell.textContent = entry.player;
        player2Cell.textContent = entry.player2;
        
        if (entry.coordinates1) {
            const [x1, y1] = entry.coordinates1.slice(1, -1).split(', ');
            x1Cell.textContent = x1;
            y1Cell.textContent = y1;
        }
        
        if (entry.coordinates2) {
            const [x2, y2] = entry.coordinates2.slice(1, -1).split(', ');
            x2Cell.textContent = x2;
            y2Cell.textContent = y2;
        }

        row.appendChild(actionCell);
        row.appendChild(modeCell);
        row.appendChild(definitionCell);
        row.appendChild(playerCell);
        row.appendChild(player2Cell);
        row.appendChild(x1Cell); // Append X_1 cell
        row.appendChild(y1Cell); // Append Y_1 cell
        row.appendChild(x2Cell); // Append X_2 cell
        row.appendChild(y2Cell); // Append Y_2 cell

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = '&times;';
        deleteButton.setAttribute('aria-label', 'Delete entry');
        deleteButton.onclick = () => {
            if (confirm('Are you sure you want to delete this entry?')) {
                deleteEntry(index);
            }
        };

        const deleteCell = document.createElement('td');
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        summaryTableBody.appendChild(row);
    });
}

function deleteEntry(index) {
    actionsLog.splice(index, 1);
    updateSummary();
}

function updateCounters() {
    document.getElementById('counter-team-1').textContent = `${team1Goals}-${team1Points.toString().padStart(2, '0')}`;
    document.getElementById('counter-team-2').textContent = `${team2Goals}-${team2Points.toString().padStart(2, '0')}`;
}

function resetSelection() {
    currentAction = '';
    currentMode = '';
    currentDefinition = '';
    currentPlayer = '';
    secondPlayer = '';
    currentCoordinates1 = ''; // Reset first coordinates
    currentCoordinates2 = ''; // Reset second coordinates (if applicable)
    marker = { x: null, y: null }; // Reset marker
}

function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
}

function showRenameInput(team) {
    if (team === '1') {
        document.getElementById('rename-team-1-input').style.display = 'inline';
        document.getElementById('confirm-rename-button-1').style.display = 'inline';
    } else if (team === '2') {
        document.getElementById('rename-team-2-input').style.display = 'inline';
        document.getElementById('confirm-rename-button-2').style.display = 'inline';
    }
}

function renameTeam(team) {
    if (team === '1') {
        const newName = document.getElementById('rename-team-1-input').value;
        if (newName.trim() !== '') {
            document.querySelectorAll('.counter-container .team-name')[0].textContent = `${newName}:`;
            document.getElementById('rename-team-1-input').style.display = 'none';
            document.getElementById('confirm-rename-button-1').style.display = 'none';
            document.getElementById('rename-team-1-input').value = ''; // Clear the input box
        } else {
            alert('Please enter a valid team name.');
        }
    } else if (team === '2') {
        const newName = document.getElementById('rename-team-2-input').value;
        if (newName.trim() !== '') {
            document.querySelectorAll('.counter-container .team-name')[1].textContent = `${newName}:`;
            document.getElementById('rename-team-2-input').style.display = 'none';
            document.getElementById('confirm-rename-button-2').style.display = 'none';
            document.getElementById('rename-team-2-input').value = ''; // Clear the input box
        } else {
            alert('Please enter a valid team name.');
        }
    }
}

function updatePlayerLabels() {
    for (let i = 1; i <= 15; i++) {
        document.querySelectorAll(`.player-button[aria-label="Select Player ${i}"]`).forEach(button => {
            button.textContent = playerNames[i];
        });
        document.querySelectorAll(`.player-button[aria-label="Select Receiver ${i}"]`).forEach(button => {
            button.textContent = playerNames[i];
        });
        document.getElementById(`player-${i}-button`).textContent = playerNames[i]; // Update home screen buttons
    }
}

function confirmChanges() {
    // Update team names
    const team1NewName = document.getElementById('rename-team-1-button').textContent.trim();
    const team2NewName = document.getElementById('rename-team-2-button').textContent.trim();

    if (team1NewName !== '') {
        document.querySelectorAll('.counter-container .team-name')[0].textContent = `${team1NewName}:`;
    } else {
        alert('Please enter a valid name for Team 1.');
        return;
    }

    if (team2NewName !== '') {
        document.querySelectorAll('.counter-container .team-name')[1].textContent = `${team2NewName}:`;
    } else {
        alert('Please enter a valid name for Team 2.');
        return;
    }

    // Update player names
    for (let i = 1; i <= 15; i++) {
        const button = document.getElementById(`player-${i}-button`);
        const newName = button.textContent.trim();
        if (newName !== '') {
            playerNames[i] = newName;
        } else {
            alert(`Please enter a valid name for Player ${i}.`);
            return;
        }
    }
    updatePlayerLabels();
    alert('Changes confirmed.');
}

document.querySelectorAll('button[contenteditable="true"]').forEach(button => {
    button.addEventListener('keydown', function(e) {
        if (e.key === ' ') {
            document.execCommand('insertHTML', false, ' ');
            e.preventDefault();
        }
    });
});

const canvas = document.getElementById('pitch');
const ctx = canvas.getContext('2d');
const confirmCoordinatesButton = document.getElementById('confirmCoordinatesButton');

let marker = { x: null, y: null };

// Draw the pitch lines
const drawLine = (startX, startY, endX, endY) => {
    ctx.beginPath();
    ctx.moveTo(mapX(startX), mapY(startY));
    ctx.lineTo(mapX(endX), mapY(endY));
    ctx.stroke();
};

// Map pitch coordinates to canvas coordinates
const mapX = x => (x / 80) * canvas.width;
const mapY = y => canvas.height - (y / 140) * canvas.height;

const drawPitch = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the pitch lines
    drawLine(0, 0, 80, 0);
    drawLine(0, 0, 0, 140);
    drawLine(0, 140, 80, 140);
    drawLine(80, 0, 80, 140);
    drawLine(0, 14, 80, 14);
    drawLine(0, 21, 80, 21);
    drawLine(0, 45, 80, 45);
    drawLine(0, 65, 80, 65);
    drawLine(0, 75, 80, 75);
    drawLine(0, 95, 80, 95);
    drawLine(0, 119, 80, 119);
    drawLine(0, 126, 80, 126);
    drawLine(35, 70, 45, 70);
    drawLine(32.5, 0, 32.5, 5);
    drawLine(47.5, 0, 47.5, 5);
    drawLine(32.5, 5, 47.5, 5);
    drawLine(30, 0, 30, 14);
    drawLine(50, 0, 50, 14);
    drawLine(32.5, 140, 32.5, 135);
    drawLine(47.5, 140, 47.5, 135);
    drawLine(32.5, 135, 47.5, 135);
    drawLine(30, 140, 30, 126);
    drawLine(50, 140, 50, 126);
    drawLine(36.5, 0, 36.5, -3);
    drawLine(43.5, 0, 43.5, -3);
    drawLine(36.5, -3, 43.5, -3);
    drawLine(36.5, 140, 36.5, 143);
    drawLine(43.5, 140, 43.5, 143);
    drawLine(36.5, 143, 43.5, 143);
    // Draw the semicircle
    drawSemicircle1(40, 21, 13);
};

// Function to draw a semicircle
const drawSemicircle1 = (centerX, centerY, radius) => {
    const mappedCenterX = mapX(centerX);
    const mappedCenterY = mapY(centerY);
    const mappedRadius = (radius / 140) * canvas.height; // Map radius to canvas scale (use height for consistency)

    ctx.beginPath();
    ctx.arc(mappedCenterX, mappedCenterY, mappedRadius, Math.PI, 2 * Math.PI);
    ctx.stroke();
};

// Draw the marker
const drawMarker = (x, y) => {
    ctx.beginPath();
    ctx.arc(mapX(x), mapY(y), 5, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.stroke();
};

// Initial draw
drawPitch();

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / canvas.width) * 80;
    const y = 140 - ((e.clientY - rect.top) / canvas.height) * 140;
    
    marker.x = x.toFixed(2);
    marker.y = y.toFixed(2);
    
    drawPitch();
    drawMarker(marker.x, marker.y);
    
    // Update the coordinate display
    document.getElementById('coordinate-display').textContent = `X: ${marker.x}, Y: ${marker.y}`;
});

confirmCoordinatesButton.addEventListener('click', () => {
    if (marker.x !== null && marker.y !== null) {
        currentCoordinates1 = `(${marker.x}, ${marker.y})`;

        if ((currentAction === 'Point - Against' || currentAction === 'Goal - Against') && currentMode !== 'Mistake') {
            logAction(); // Log action directly for No Mistake
            switchScreen('action-buttons'); // Return to main stats screen
        } else if (currentAction === 'Miss - Against') {
            logAction(); // Log action directly for Miss - Against
            switchScreen('action-buttons'); // Return to main stats screen
        } else {
            switchScreen('player-buttons'); // Go to player selection screen for other actions
        }
    } else {
        alert('Please place a marker on the pitch.');
    }
});

function toggleCoordinates() {
    coordinatesEnabled = document.getElementById('toggle-coordinates').checked;
}

function exportSummaryToCSV() {
    const rows = [];
    const summaryTable = document.getElementById('summary-table');

    // Get the headers
    const headers = [];
    summaryTable.querySelectorAll('thead th').forEach(th => {
        headers.push(th.textContent);
    });
    rows.push(headers.join(','));

    // Get the rows
    summaryTable.querySelectorAll('tbody tr').forEach(tr => {
        const cells = [];
        tr.querySelectorAll('td').forEach(td => {
            cells.push(td.textContent);
        });
        rows.push(cells.join(','));
    });

    // Create CSV string
    const csvContent = rows.join('\n');

    // Create a Blob from the CSV string
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Get team names
    const team1Name = document.querySelectorAll('.counter-container .team-name')[0].textContent.slice(0, -1);
    const team2Name = document.querySelectorAll('.counter-container .team-name')[1].textContent.slice(0, -1);

    // Create a link to download the Blob
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${team1Name} - ${team2Name}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

