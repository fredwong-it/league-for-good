import axios from 'axios';
import { ADD_PLAYER, ADD_PLAYER_TO_TEAM, OPEN_SNACKBAR } from '../types';
import { ROOT_URL } from '../../../globals';
import { openSnackbar } from '../index';


// Add a new player to DB,
export function createPlayer(form, dispatch, props) {
	const { teams } = props;
	const { team, ...player } = form;

	// format the request body to match the format of player model
	const reqBody = { ...player, teams: [team] };

	if (team && team.teamId) {
		const match = teams.find(t => t._id === team.teamId);
		team.seasonId = match.seasonId;
	}

	axios.post(`${ROOT_URL}/player/add`, reqBody)
		.then(({data}) => {
			// successful message
			openSnackbar(form, dispatch, props);

			// Send new player to the playersReducer to be appended to the list
			dispatch({ type: ADD_PLAYER, payload: data });

			// send newly created player to team if team was selected
			if ( team && team.teamId ) {
				dispatch({
					type: ADD_PLAYER_TO_TEAM,
					payload: { teamId: team.teamId, player: data }
				});
			}
		})
		.catch(error => {
			// display error message
			dispatch({ type: OPEN_SNACKBAR, message: error.response.data.message });
		});
}
