import './App.css';
import { Component } from 'react'
import axios from 'axios'

const picks = [
  {
    name: 'Geoff',
    picks: ['bucks', 'grizzlies', 'hornets']
  },
  {
    name: 'Cheeks',
    picks: ['lakers', 'pacers', 'knicks']
  },
  {
    name: 'Jer',
    picks: ['clippers', 'rockets', 'thunder']
  },
  {
    name: 'Pete',
    picks: ['nuggets', 'timberwolves', 'bulls']
  },
  {
    name: 'Seb',
    picks: ['heat', 'warriors', 'pistons']
  },
  {
    name: 'Schwab',
    picks: ['celtics', 'hawks', 'magic']
  },
  {
    name: 'Greg',
    picks: ['raptors', 'jazz', 'cavaliers']
  },
  {
    name: 'Matty D',
    picks: ['mavericks', 'wizards', 'pelicans']
  },
  {
    name: 'Briin',
    picks: ['nets', 'blazers', 'spurs']
  },
  {
    name: 'Neil',
    picks: ['sixers', 'suns', 'kings']
  },
] 

class App extends Component {
  state = {
    standings: '',
    maxPlayerWins: '',
    maxTeamWins: ''
  }
  
  componentDidMount() {
    axios.get('https://data.nba.net/prod/v1/current/standings_all_no_sort_keys.json')
      .then(res => {
        this.organizeStandings(res.data);
      })
  }

  organizeStandings(standingsData) {
    const {teams} = standingsData.league.standard
    const winsByTeam = {}
    teams.forEach(team => {
      winsByTeam[team.teamSitesOnly.teamCode] = team.win
    })
    this.assignToPlayers(winsByTeam)
  }

  assignToPlayers(winsByTeam) {
    const picksAndWins = []
    let maxPlayerWins = 0
    let maxTeamWins = 0
    picks.forEach(player => {
      const playerObj = {}
      playerObj.total = 0
      playerObj.name = player.name
      player.picks.forEach((pick, idx) => {
        playerObj['pick' + (idx + 1)] = [pick,winsByTeam[pick]]
        playerObj.total += parseInt(winsByTeam[pick])
        if (parseInt(winsByTeam[pick]) > maxTeamWins) {
          maxTeamWins = parseInt(winsByTeam[pick])
        }
      })
      if (playerObj.total > maxPlayerWins) {
        maxPlayerWins = playerObj.total
      }
      picksAndWins.push(playerObj)
    })
    const standings = picksAndWins.sort((a, b) => {
      return b.total - a.total
    })
    this.setState({
      standings,
      maxTeamWins,
      maxPlayerWins
    })
  }
  
  render() {
    const {standings, maxPlayerWins, maxTeamWins} = this.state
    let playerList = []
    if (standings) {
      
        return (
          <>
            <h1>SCHWAB'S WINS POOL</h1>
            {playerList = standings.map(player => {
              return (<PlayerItem 
                details={player} 
                maxTeamWins={maxTeamWins} 
                maxPlayerWins={maxPlayerWins}
                key={player.name}
              />
              )
            })}  
          </>
        ) 
    }
    return (
      <div>
        {playerList}
      </div>
    )
  }
}

class PlayerItem extends Component {
  render() {
    const {maxPlayerWins, maxTeamWins, details} = this.props
    const {total, pick1, pick2, pick3, name} = details
    return (  
      <div className='player-item'>
        <div 
          className='total'
          style={{fontSize: `${10 * total / maxPlayerWins + 2}rem`}}
        >
          <div>{name}</div>
          <div>{total}</div>
        </div>
        <div 
          className='pick1'
          style={{fontSize: `${5 * pick1[1] / maxTeamWins + 1}rem`}}
        >
          <div>{pick1[0]}</div>
          <div>{pick1[1]}</div>
        </div>
        <div 
          className='pick2'
          style={{fontSize: `${5 * pick2[1] / maxTeamWins+ 1}rem`}}
        >
          <div>{pick2[0]}</div>
          <div>{pick2[1]}</div>
        </div>
        <div 
          className='pick3'
          style={{fontSize: `${5 * pick3[1] / maxTeamWins+ 1}rem`}}
        >
          <div>{pick3[0]}</div>
          <div>{pick3[1]}</div>
        </div>
      </div>  
    )
  }
}


export default App;
