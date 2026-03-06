// Returns the path node sequence for a given building id
export function getPathForBuilding(buildingId) {
  switch (buildingId) {
    case 'block-a':
      return ['O', 'A'];
    case 'block-b':
      return ['O', 'B', 'C', 'X'];
    case 'block-c':
      return ['O', 'B', 'C', 'E', 'F', 'G'];
    case 'ground':
      return ['O', 'B', 'C', 'E', 'H'];
    case 'boys-hostel':
      return ['O', 'B', 'C', 'E', 'H', 'I', 'J'];
    case 'girls-hostel':
      return ['O', 'B', 'M', 'S', 'T'];
    case 'canteen':
      return ['O', 'B', 'M', 'P', 'Y'];
    case 'gate-2':
      return ['O', 'B', 'M', 'P', 'U'];
    case 'gate-3':
      return ['O', 'B', 'C', 'E', 'H', 'I', 'K'];
    case 'kalam':
      return ['O', 'B', 'C', 'E', 'H', 'I', 'K', 'L', 'N', 'D'];
    case 'main-gate':
    case 'security-room':
    case 'student-parking':
      return ['O', 'B', 'M', 'S'];
    case 'bus-parking':
      return ['O', 'B', 'M', 'X1'];
    default:
      return [];
  }
}
