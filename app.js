document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'bfe96fb7ad394f23a65e1af5ca8ad0c9';
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const matchesList = document.getElementById('matches-list');

    fetch(`https://api.football-data.org/v4/competitions/PD/matches?dateFrom=${today}&dateTo=${nextWeek}`, {
        headers: {
            'X-Auth-Token': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.matches.length === 0) {
            console.log('No se encontraron partidos o el formato de datos es incorrecto.');
            return;
        }

        data.matches.forEach(match => {
            const listItem = document.createElement('li');

            const homeTeamLogo = match.homeTeam.crestUrl;
            const awayTeamLogo = match.awayTeam.crestUrl;

            listItem.innerHTML = `
                <div class="team-info">
                    <img src="${homeTeamLogo}" alt="${match.homeTeam.name}" class="team-logo">
                    <span class="team-name">${match.homeTeam.name}</span>
                </div>
                <div class="team-info">
                    <img src="${awayTeamLogo}" alt="${match.awayTeam.name}" class="team-logo">
                    <span class="team-name">${match.awayTeam.name}</span>
                </div>
                <div class="status">${match.status === 'IN_PLAY' ? `Minuto ${match.minute}` : match.status.replace('_', ' ')}</div>
                <div class="date">${new Date(match.utcDate).toLocaleString()}</div>
            `;

            matchesList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error al obtener datos desde la API:', error));
});
