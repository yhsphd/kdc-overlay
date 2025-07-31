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

exports = module.exports = { parseMatch, parseQualsResults };
