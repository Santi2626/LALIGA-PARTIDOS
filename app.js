document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'bfe96fb7ad394f23a65e1af5ca8ad0c9';
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const startDate = formatDate(today);
    const endDate = formatDate(nextWeek);

    const endpoint = `https://api.football-data.org/v4/competitions/PD/matches?dateFrom=${startDate}&dateTo=${endDate}`;

    fetch(endpoint, {
        method: 'GET',
        headers: {
            'X-Auth-Token': apiKey,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        displayMatches(data.matches);
    })
    .catch(error => {
        console.error(`Error al obtener datos desde la API: ${error.message}`);
    });
});

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateTime(dateTime) {
    const matchDate = new Date(dateTime);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return matchDate.toLocaleDateString('es-ES', options);
}

function displayMatches(matches) {
    const matchesList = document.getElementById('matches-list');

    if (!matches || matches.length === 0) {
        console.log('No se encontraron partidos o el formato de datos es incorrecto.');
        return;
    }

    matches.forEach(match => {
        const listItem = document.createElement('li');
        const matchStatus = getMatchStatus(match.status);
        const matchResult = getMatchResult(match.score);
        const matchDateTime = formatDateTime(match.utcDate);

        listItem.textContent = `${matchDateTime} - ${match.homeTeam.name} ${matchResult} ${match.awayTeam.name} (${matchStatus})`;
        matchesList.appendChild(listItem);
    });
}

function getMatchStatus(status) {
    switch (status) {
        case 'SCHEDULED':
            return 'Programado';
        case 'LIVE':
            return 'En Vivo';
        case 'IN_PLAY':
            return 'En Juego';
        case 'PAUSED':
            return 'Pausado';
        case 'FINISHED':
            return 'Finalizado';
        default:
            return 'Desconocido';
    }
}

function getMatchResult(score) {
    if (score.fullTime.homeTeam === null || score.fullTime.awayTeam === null) {
        return 'vs';
    }
    return `${score.fullTime.homeTeam} - ${score.fullTime.awayTeam}`;
}
