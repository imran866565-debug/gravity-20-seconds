/* "What if gravity switched off for 20 seconds?" — 3D Kaz short, ~20 s, 5 shots.
   No people anywhere: street, house, car, chairs, books, water only.
   Cut points B come from tools/timing.py on voice.mp3 — replace the
   placeholder array below with its output before rendering. */
const K = KAZ, T = K.THREE, PI = Math.PI;
K.config({ leftLabel: 'GRAVITY', rightLabel: 'STATUS', prefix: '', capIn: .08, capOut: .18 });
const B = [0.0, 3.51, 8.32, 13.13, 17.37, 21.94];
let n = 0;
const S = o => { const i = n++; K.shot(Object.assign({ dur: (Math.round(B[i + 1] * 30) - Math.round(B[i] * 30)) / 30 }, o)); };

// One quiet street, reused across beats: road, house, tree, car, garden
// table with chairs, books and a mug. All floats are pure functions of t.
function street() {
  const scene = K.outdoor({ mood: 'dusk' });
  K.road({ width: 5, length: 30, z: 2 });
  K.house(-6.5, -5, { wall: 0xf2e3c6, roof: 0xb5502e, door: 0x5b4636, rot: 0.3 });
  K.house(6.5, -6, { wall: 0xdfe8ec, roof: 0x3e6b8f, door: 0x334155, rot: -0.4 });
  K.tree(-4.5, -3.5, 1.1, 5);
  K.tree(5.5, -3.5, 0.9, 9);
  const car = K.car(0xd94f3d);
  car.position.set(-1.5, 0, 2);
  car.rotation.y = 0.15;
  scene.add(car);
  const table = K.table({ w: 1.8, d: 1.1, h: 0.75, color: 0x8a6a4f });
  table.position.set(2.5, 0, -1.5);
  scene.add(table);
  const chair1 = K.chair(0x3e6b8f);
  chair1.position.set(1.4, 0, -1.2);
  chair1.rotation.y = 0.6;
  scene.add(chair1);
  const chair2 = K.chair(0x3e6b8f);
  chair2.position.set(3.6, 0, -1.8);
  chair2.rotation.y = -2.2;
  scene.add(chair2);
  // a small stack of books on the table
  const books = [];
  const bookCols = [0xc0392b, 0x2e86c1, 0x28b463];
  for (let i = 0; i < 3; i++) {
    const b = K.box(0.45, 0.09, 0.32, bookCols[i], 0, 0, 0);
    b.position.set(2.3 + i * 0.12, 0.80 + i * 0.095, -1.45);
    b.rotation.y = (i - 1) * 0.25;
    scene.add(b);
    books.push(b);
  }
  const mug = K.mug(2.9, 0.85, -1.7);
  scene.add(mug);
  // a pond of water beside the road
  const pond = K.cyl(1.3, 1.3, 0.18, 0x3e8fbf, -3.5, 0.09, 4.2, 12);
  scene.add(pond);
  return { scene, car, chair1, chair2, books, mug, pond, tableTop: 0.75 };
}

// 1. The question: a normal evening street, everything grounded.
S({
  value: '1.00g', status: 'NORMAL', sub: 'T+0s',
  caption: 'What if gravity switched off<br>for twenty seconds?',
  setup() {
    const { scene } = street();
    const cam = K.camera(38);
    return { scene, camera: cam, update(t, k) {
      K.dolly(cam, k, [0, 1.6, 12], [0, 1.4, 10.5], [0, 1, 0]);
    } };
  },
});

// 2. The float: chairs, books and the mug rise first, then the car.
S({
  value: '0.00g', status: 'FLOATING', sub: 'T+5s',
  caption: 'Everything not tied down would start to float —<br>chairs, books, and cars.',
  setup() {
    const { scene, car, chair1, chair2, books, mug } = street();
    const cam = K.camera(38);
    const rise = (t, t0, h) => h * K.smooth(K.ramp(t, t0, 1.6));
    return { scene, camera: cam, update(t, k) {
      chair1.position.y = rise(t, 0.9, 2.2);
      chair1.rotation.z = 0.25 * K.smooth(K.ramp(t, 0.9, 1.6));
      chair2.position.y = rise(t, 1.3, 2.6);
      chair2.rotation.x = -0.2 * K.smooth(K.ramp(t, 1.3, 1.6));
      books.forEach((b, i) => {
        b.position.y = 0.80 + i * 0.095 + rise(t, 1.7 + i * 0.25, 3.0 + i * 0.4);
        b.rotation.y = (i - 1) * 0.25 + t * 0.25;
      });
      mug.position.y = 0.85 + rise(t, 2.1, 3.4);
      mug.rotation.z = t * 0.3;
      car.position.y = rise(t, 2.8, 1.4);
      car.rotation.z = 0.08 * K.smooth(K.ramp(t, 2.8, 1.6));
      K.dolly(cam, k, [0, 1.4, 10.5], [0, 2.2, 9], [0, 1.5, 0]);
    } };
  },
});

// 3. The sky: water lifts out of the pond in glowing blue blobs and rises.
S({
  value: '0.00g', status: 'DRIFTING', sub: 'T+10s',
  caption: 'The air itself would drift away,<br>and rivers would rise into the sky.',
  setup() {
    const { scene, car, chair1, chair2, books, mug, pond } = street();
    const cam = K.camera(38);
    // water blobs that rise out of the pond over the shot
    const drops = [];
    const rng = K.rng(42);
    for (let i = 0; i < 7; i++) {
      const d = K.ball(0.24 + rng() * 0.18, 0x4db2ff, 0, 0, 0, 1,
        { emissive: 0x1a6fd4, emissiveIntensity: 0.9 });
      d.position.set(-3.5 + (rng() - 0.5) * 1.6, 0.2, 4.2 + (rng() - 0.5) * 1.2);
      scene.add(d);
      drops.push({ m: d, y0: 0.2, h: 3.5 + rng() * 2.5, t0: 0.2 + rng() * 1.2 });
    }
    return { scene, camera: cam, update(t, k) {
      // everything keeps floating where shot 2 left it
      chair1.position.y = 2.2;
      chair1.rotation.z = 0.25;
      chair2.position.y = 2.6;
      chair2.rotation.x = -0.2;
      books.forEach((b, i) => { b.position.y = 0.80 + i * 0.095 + 3.0 + i * 0.4; b.rotation.y = (i - 1) * 0.25 + t * 0.25; });
      mug.position.y = 0.85 + 3.4;
      mug.rotation.z = t * 0.3;
      car.position.y = 1.4;
      car.rotation.z = 0.08;
      drops.forEach(d => {
        d.m.position.y = d.y0 + d.h * K.smooth(K.ramp(t, d.t0, 2.2));
        d.m.position.x += 0; // pure function: no accumulation
      });
      pond.scale.set(1 - 0.55 * K.smooth(k), 1, 1 - 0.55 * K.smooth(k));
      K.dolly(cam, k, [0, 2.8, 12], [0, 4.4, 11], [-1.5, 2.2, 1.5]);
    } };
  },
});

// 4. The snap-back: gravity returns and everything falls at once.
S({
  value: '1.00g', status: 'FALLING', sub: 'T+20s',
  caption: 'Then gravity snaps back,<br>and everything falls at once.',
  setup() {
    const { scene, car, chair1, chair2, books, mug, pond } = street();
    const cam = K.camera(38);
    const fall = (t, fromY, delay) => fromY * (1 - K.smooth(K.ramp(t, delay, 0.55)));
    return { scene, camera: cam, update(t, k) {
      chair1.position.y = fall(t, 2.2, 0.25);
      chair1.rotation.z = 0.25 * (1 - K.smooth(K.ramp(t, 0.25, 0.55)));
      chair2.position.y = fall(t, 2.6, 0.3);
      chair2.rotation.x = -0.2 * (1 - K.smooth(K.ramp(t, 0.3, 0.55)));
      books.forEach((b, i) => { b.position.y = (0.80 + i * 0.095 + 3.0 + i * 0.4) * (1 - K.smooth(K.ramp(t, 0.35 + i * 0.05, 0.5))); b.rotation.y = (i - 1) * 0.25; });
      mug.position.y = (0.85 + 3.4) * (1 - K.smooth(K.ramp(t, 0.4, 0.5)));
      car.position.y = fall(t, 1.4, 0.15);
      car.rotation.z = 0.08 * (1 - K.smooth(K.ramp(t, 0.15, 0.55)));
      pond.scale.set(0.45 + 0.55 * K.smooth(K.ramp(t, 0.5, 0.8)), 1, 0.45 + 0.55 * K.smooth(K.ramp(t, 0.5, 0.8)));
      K.dolly(cam, k, [0, 3.6, 8], [0, 1.6, 11], [0, 1, 0]);
    } };
  },
});

// 5. The punchline: the street is calm again, everything back in place.
S({
  value: '1.00g', status: 'BACK DOWN', sub: 'T+20s',
  caption: 'Twenty seconds of weightlessness.<br>A very long way down.',
  card: '<h4>Twenty seconds of</h4><b>weightlessness</b>',
  setup() {
    const { scene } = street();
    const cam = K.camera(38);
    return { scene, camera: cam, update(t, k) {
      K.dolly(cam, k, [0, 1.6, 11], [0, 2.0, 9.5], [0, 1, 0]);
    } };
  },
});
