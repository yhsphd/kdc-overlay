function parseMatch(rows, id) {
  const dataRow = rows.find((row) => row[0] === id.toString());

  if (!dataRow) {
    throw new Error(`Match ID ${id} not found.`);
  }

  // Fixed column indices based on your layout
  const RED_INDEX_COL = 4;
  const BLUE_INDEX_COL = 5;
  const BO_COL = 6;
  const RED_PROTECT_COL = 7;
  const RED_BAN_COL = 8;
  const BLUE_PROTECT_COL = 9;
  const BLUE_BAN_COL = 10;
  const RED_ROLL_COL = 11;
  const BLUE_ROLL_COL = 12;
  const FIRST_PICK_COL = 13;
  const RED_FIRST_PICK_COL = 14;
  const BLUE_FIRST_PICK_COL = 15;

  // Pick columns: Assuming they start at index 15
  const PICK_START_COL = 17;
  const PICK_END_COL = PICK_START_COL + 16;

  // Winner columns: Assuming they start after pick section + 1
  const WINNER_START_COL = PICK_END_COL + 1;
  const WINNER_END_COL = WINNER_START_COL + 16;

  // Match Done column: last column
  const DONE_COL = WINNER_END_COL + 1;

  return {
    id: Number(dataRow[0]),
    round: dataRow[1],
    round_code: dataRow[2],
    schedule: dataRow[3],
    pre_match: {
      red_index: Number(dataRow[RED_INDEX_COL]) || null,
      blue_index: Number(dataRow[BLUE_INDEX_COL]) || null,
      bo: dataRow[BO_COL] || null,
      red_protect: dataRow[RED_PROTECT_COL] || null,
      red_ban: dataRow[RED_BAN_COL] || null,
      blue_protect: dataRow[BLUE_PROTECT_COL] || null,
      blue_ban: dataRow[BLUE_BAN_COL] || null,
      red_roll: dataRow[RED_ROLL_COL] || null,
      blue_roll: dataRow[BLUE_ROLL_COL] || null,
      first_pick: dataRow[FIRST_PICK_COL] || null,
      red_first_pick: dataRow[RED_FIRST_PICK_COL] || null,
      blue_first_pick: dataRow[BLUE_FIRST_PICK_COL] || null,
    },
    pick: dataRow
      .slice(PICK_START_COL, PICK_END_COL)
      .filter((x) => x) // Filter blanks out
      .map((x) => (x === "TB" ? "TB1" : x)), // All the mappools must have index number (TB -> TB1)
    winner: dataRow.slice(WINNER_START_COL, WINNER_END_COL).filter((x) => x),
    done: dataRow[DONE_COL] === "TRUE" || dataRow[DONE_COL] === true,
  };
}

function parseQualsResults(rows) {
  // Get map codes from the first row (RC1, RC2, etc)
  const mapCodes = rows[0]
    .slice(2)
    .filter((x) => x)
    .filter((x, i, arr) => arr.indexOf(x) === i);

  // Find column positions from the header row (row[1])
  const headerRow = rows[1];
  const rankStart = headerRow.findIndex((x) => x === "Rank");
  const scoreStart = headerRow.findIndex((x) => x === "Score");
  const accStart = headerRow.findIndex((x) => x === "V2 Acc");
  const scoreCountStart = headerRow.findIndex((x) => x === "# scores");
  const maStart = headerRow.findIndex((x) => x === "MA");

  // Skip header rows
  const dataRows = rows.slice(2);

  return dataRows
    .filter((row) => row[0] && row[1]) // Only process rows with ID and player name
    .map((row) => {
      // Find summary column positions
      const sumRankCol = headerRow.findIndex((x) => x === "Sum Rank");
      const avgScoreCol = headerRow.findIndex((x) => x === "Av. Score");
      const adjAvScoreCol = avgScoreCol + 1;
      const avgAccCol = headerRow.findIndex((x) => x === "Av. Acc");
      const adjAvAccCol = avgAccCol + 1;
      const totalScoreCol = headerRow.findIndex((x) => x === "Total");
      const avgMaCol = headerRow.findIndex((x) => x === "Avg. MA");

      // Parse maps data
      const maps = mapCodes.map((code, i) => ({
        code,
        rank: Number(row[rankStart + i]) || 0,
        score: Number(row[scoreStart + i]?.replace(/,/g, "")) || 0,
        acc: Number(row[accStart + i]) || 0,
        scoreCount: Number(row[scoreCountStart + i]) || 0,
        ma: Number(row[maStart + i]) || 0,
      }));

      return {
        id: Number(row[0]),
        nick: row[1],
        maps,
        rank_sum: Number(row[sumRankCol]) || 0,
        score_avg: Number(row[avgScoreCol]?.replace(/,/g, "")) || 0,
        score_adj_avg: Number(row[adjAvScoreCol]?.replace(/,/g, "")) || 0,
        acc_avg: Number(row[avgAccCol]?.replace(/%/g, "")) / 100 || 0,
        acc_adj_avg: Number(row[adjAvAccCol]?.replace(/%/g, "")) / 100 || 0,
        score_count: Number(row[totalScoreCol]) || 0,
        ma_avg: Number(row[avgMaCol]) || 0,
      };
    });
}

function parseOiiResults(rows) {
  const mapIdRow = rows[0];
  const mapInfoRow = rows[1];
  const headerRow = rows[2];
  const dataRows = rows.slice(3);

  // Find map sections by looking for round names in the second row
  const mapSections = [];
  for (let i = 2; i < mapInfoRow.length; i++) {
    const roundName = mapInfoRow[i];
    if (roundName && roundName.trim() !== "") {
      const mapCode = mapInfoRow[i + 1];
      const titleArtistDiff = mapInfoRow[i + 2];
      const mapId = Number(mapIdRow[i + 5]) || 0; // Map ID is 5 columns after round name (H1 when round is C2)
      
      if (mapCode && titleArtistDiff) {
        mapSections.push({
          roundName,
          mapCode,
          titleArtistDiff,
          mapId,
          startCol: i,
        });
        
        // Skip to next section (each section takes 7 columns)
        i += 6;
      }
    }
  }

  // Define stats header for calculating column positions
  const statsHeader = ["rank", "score", "v2 acc", "ma", "nth", "# scores", "tickets"];

  // Group maps by round name
  const roundsMap = {};
  mapSections.forEach((section, sectionIndex) => {
    if (!roundsMap[section.roundName]) {
      roundsMap[section.roundName] = [];
    }

    const leaderboard = [];
    const currentMapStartCol = headerRow.indexOf("rank") + sectionIndex * statsHeader.length;

    dataRows.forEach((row) => {
      // Only process if there's a score for the map
      const score = row[currentMapStartCol + 1];
      if (row[0] && row[1] && score) {
        leaderboard.push({
          id: Number(row[0]),
          nick: row[1],
          rank: Number(row[currentMapStartCol]),
          score: Number(row[currentMapStartCol + 1]?.replace(/,/g, "")),
          acc: Number(row[currentMapStartCol + 2]?.replace(/%/g, "")) / 100,
          ma: Number(row[currentMapStartCol + 3]),
          nth: Number(row[currentMapStartCol + 4]),
          scores: Number(row[currentMapStartCol + 5]),
          tickets: Number(row[currentMapStartCol + 6]),
        });
      }
    });

    // Sort leaderboard by rank
    leaderboard.sort((a, b) => a.rank - b.rank);

    roundsMap[section.roundName].push({
      map: {
        code: section.mapCode,
        titleArtistDiff: section.titleArtistDiff,
        id: section.mapId,
      },
      leaderboard,
    });
  });

  return roundsMap;
}

function parseDrawResults(rows) {
  const headerRow = rows[1];
  const dataRows = rows.slice(2);
  
  // Find column positions
  const roundCol = headerRow.findIndex(x => x === "round");
  const pickCol = headerRow.findIndex(x => x === "pick");
  const mapIdCol = headerRow.findIndex(x => x === "map id");
  const mapTitleCol = headerRow.findIndex(x => x === "map title");
  const abbrCol = headerRow.findIndex(x => x === "abbr");
  
  // Find winner columns (id1, player1, id2, player2, etc.)
  const winnerCols = [];
  for (let i = 0; i < headerRow.length; i++) {
    if (headerRow[i] && headerRow[i].match(/^id\d+$/)) {
      const playerCol = headerRow.findIndex(x => x === headerRow[i].replace("id", "player"));
      if (playerCol !== -1) {
        winnerCols.push({ idCol: i, playerCol });
      }
    }
  }
  
  // Group results by round abbreviation
  const results = {};
  
  dataRows.forEach(row => {
    if (!row[abbrCol] || !row[pickCol]) return; // Skip empty rows
    
    const roundAbbr = row[abbrCol];
    const mapCode = row[pickCol];
    const mapId = Number(row[mapIdCol]) || 0;
    const mapTitle = row[mapTitleCol] || "";
    
    // Extract winners
    const winners = [];
    winnerCols.forEach(({ idCol, playerCol }) => {
      const id = row[idCol];
      const nick = row[playerCol];
      if (id && nick) {
        winners.push({
          id: Number(id),
          nick: nick
        });
      }
    });
    
    // Initialize round array if it doesn't exist
    if (!results[roundAbbr]) {
      results[roundAbbr] = [];
    }
    
    // Add map result to the round
    results[roundAbbr].push({
      map: {
        code: mapCode,
        id: mapId,
        title: mapTitle
      },
      winners
    });
  });
  
  return results;
}

exports = module.exports = { parseMatch, parseQualsResults, parseOiiResults, parseDrawResults };
