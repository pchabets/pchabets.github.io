function getGrade(){
  var grade = randomTruncSkewNormal({
    range: [1,10],
    mean: 7.5,
    stdDev: 1
  })
  var gradeRounded = Math.round(grade*10)/10
  return gradeRounded
}

function randomTruncSkewNormal({
  rng = Math.random,
  range = [-Infinity, Infinity],
  mean,
  stdDev,
  skew = 0
}) {
  // Box-Muller transform
  function randomNormals(rng) {
    let u1 = 0,
      u2 = 0;
    //Convert [0,1) to (0,1)
    while (u1 === 0) u1 = rng();
    while (u2 === 0) u2 = rng();
    const R = Math.sqrt(-2.0 * Math.log(u1));
    const Θ = 2.0 * Math.PI * u2;
    return [R * Math.cos(Θ), R * Math.sin(Θ)];
  }

  // Skew-normal transform
  // If a variate is either below or above the desired range,
  // we recursively call the randomSkewNormal function until
  // a value within the desired range is drawn
  function randomSkewNormal(rng, mean, stdDev, skew = 0) {
    const [u0, v] = randomNormals(rng);
    if (skew === 0) {
      const value = mean + stdDev * u0;
      if (value < range[0] || value > range[1])
        return randomSkewNormal(rng, mean, stdDev, skew);
      return value;
    }
    const sig = skew / Math.sqrt(1 + skew * skew);
    const u1 = sig * u0 + Math.sqrt(1 - sig * sig) * v;
    const z = u0 >= 0 ? u1 : -u1;
    const value = mean + stdDev * z;
    if (value < range[0] || value > range[1])
      return randomSkewNormal(rng, mean, stdDev, skew);
    return value;
  }

  return randomSkewNormal(rng, mean, stdDev, skew);
}
