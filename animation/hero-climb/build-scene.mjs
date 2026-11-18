import { writeFileSync } from 'node:fs';

// Source coordinates match x-reference.png. Each contact remains constant across
// its load-bearing interval. Rive's native two-bone IK solves elbows and knees.
const poses = [
  // seconds, hip, left hand, right hand, left foot, right foot
  [0, [89,132], [78,110], [101,110], [83,163], [98,160]],
  [1, [89,132], [78,110], [101,110], [83,163], [98,160]],
  [1.65, [89,111], [65,79], [101,91], [83,146], [98,143]],
  [2.45, [86,88], [65,79], [97,68], [78,124], [96,122]],
  [3.1, [77,73], [65,79], [55,29], [64,80], [91,104]],
  [3.55, [70,67], [45,29], [55,29], [64,80], [82,99]],
  [4.25, [59,44], [45,29], [55,29], [64,80], [74,75]],
  [4.75, [48,23], [37,29], [60,29], [58,54], [68,51]],
  [5.15, [48,29], [37,29], [60,29], [58,55], [67,51]],
  [5.7, [48,29], [37,29], [72.6814,-24.7282], [58,55], [67,51]],
  [9.7, [48,29], [37,29], [72.6814,-24.7282], [58,55], [67,51]],
  [10.3, [48,29], [37,29], [60,29], [58,55], [67,51]],
  [10.6, [48,29], [37,29], [60,29], [58,55], [67,51]]
];
const smooth = t => t * t * (3 - 2 * t);
function poseAt(t) {
  const index = poses.findIndex(p => p[0] >= t);
  const end = poses[Math.max(1, index)];
  const start = poses[Math.max(0, index - 1)];
  const blend = smooth(Math.max(0, Math.min(1, (t - start[0]) / (end[0] - start[0]))));
  const p = start.slice(1).map((v, i) => v.map((n, axis) => n + (end[i + 1][axis] - n) * blend));
  if (t >= 5.7 && t <= 9.7) {
    const wave = Math.sin((t - 5.7) * Math.PI * 3);
    const envelope = Math.min(1, (t - 5.7) * 5, (9.7 - t) * 5);
    const angle = -Math.PI / 2 + wave * .32 * envelope;
    p[2][0] = 57 + 19 * Math.cos(-.6) + 19 * Math.cos(angle);
    p[2][1] = 5 + 19 * Math.sin(-.6) + 19 * Math.sin(angle);
  }
  if (t > 5.15) {
    const swing = Math.sin((t - 5.15) * 9) * Math.exp(-(t - 5.15) * 3) * 4;
    p[3][0] += swing;
    p[4][0] -= swing * .7;
  }
  return p;
}
let nextId = 100;
const id = () => `0:${nextId++}`;
const stroke = '<Stroke thickness="2.3" cap="round" join="round"><SolidColor colorValue="FFEEEAE0"/></Stroke>';
function line(name, vertices) {
  return `<Shape name="${name}"><PointsPath>${vertices.map(([x,y]) => `<StraightVertex x="${x}" y="${y}"/>`).join('')}</PointsPath>${stroke}</Shape>`;
}
function artboard(name, reference) {
  const machine = id(), entrance = id(), idle = id(), entryState = id(), idleState = id();
  const clip = id(), hip = id(), head = id(), face = id(), style = id(), artboardId = id();
  const targets = Array.from({length:4}, id);
  const roots = Array.from({length:4}, id);
  const wrists = [id(), id()];
  const lowerBones = Array.from({length:4}, id);
  const constraints = Array.from({length:4}, id);
  let content = `<Node y="60" name="PNG coordinate space">
    <Shape id="${clip}" name="Centre emergence mask"><Rectangle x="-100" y="-60" width="400" height="140" originX="0" originY="0"/></Shape>
    <Node name="Character"><ClippingShape sourceId="${clip}"/>
    <Node id="${head}" name="Head"><Shape><Ellipse width="14" height="14"/>${stroke}</Shape>
      <Node id="${face}" name="Look direction">${line('Face',[[1,-1],[3,-1]])}</Node></Node>
    <Node id="${hip}" name="Pelvis">${line('Spine',[[0,0],[1,-15],[3,-28]])}${line('Shoulders',[[-5,-24],[3,-28],[9,-24]])}</Node>`;
  ['Left arm','Right arm','Left leg','Right leg'].forEach((label, i) => {
    const length = i < 2 ? 19 : 22;
    content += `<Node name="${label} contact target" id="${targets[i]}"/>
      <RootBone name="${label} upper" id="${roots[i]}" length="${length}" rotation="1.57">
        ${line(`${label} upper stroke`,[[0,0],[length,0]])}
        <Bone id="${lowerBones[i]}" name="${label} lower" length="${length}">
          <IKConstraint id="${constraints[i]}" name="${label} contact IK" targetId="${targets[i]}" parentBoneCount="1" invertDirection="${i !== 0}"/>
          ${line(`${label} lower stroke`,[[0,0],[length,0]])}
        </Bone>
      </RootBone>`;
    if (i < 2) content += `<Node name="${label} palm" id="${wrists[i]}">${line('Fingers',[[0,0],[2,-3],[4,-2]])}</Node>`;
    else content += `<Node name="${label} foot" x="0" y="0"><TranslationConstraint targetId="${targets[i]}"/>${line('Toes',[[0,0],[4,0]])}</Node>`;
  });
  content += '</Node></Node>';
  if (reference) content += '<Image assetId="0:1" name="X reference" x="0" y="60" originX="0" originY="0"/>';
  const tracks = new Map();
  function key(object, property, frame, value) {
    const name = `${object}/${property}`;
    if (!tracks.has(name)) tracks.set(name, []);
    tracks.get(name).push([frame, Math.round(value * 10000) / 10000]);
  }
  function xy(object, frame, value) { key(object,'x',frame,value[0]); key(object,'y',frame,value[1]); }
  for (let frame = 0; frame <= 636; frame += 2) {
    const t = frame / 60;
    const [pelvis, lh, rh, lf, rf] = poseAt(t);
    xy(hip,frame,pelvis);
    xy(head,frame,[pelvis[0],pelvis[1]-37]);
    [lh,rh,lf,rf].forEach((target,i) => xy(targets[i],frame,target));
    xy(roots[0],frame,[pelvis[0]-5,pelvis[1]-24]);
    xy(roots[1],frame,[pelvis[0]+9,pelvis[1]-24]);
    xy(roots[2],frame,[pelvis[0]-2,pelvis[1]]);
    xy(roots[3],frame,[pelvis[0]+2,pelvis[1]]);
    xy(wrists[0],frame,lh); xy(wrists[1],frame,rh);
    key(wrists[1],'rotation',frame,t >= 5.7 && t <= 9.7 ? Math.sin((t-5.7)*Math.PI*3)*.3 : 0);
    // FK during the greeting fixes the elbow. Only the forearm and wrist wave.
    key(roots[1], 'rotation', frame, -.6);
    const envelope = Math.max(0, Math.min(1, (t - 5.7) * 5, (9.7 - t) * 5));
    key(lowerBones[1], 'rotation', frame, -Math.PI / 2 + .6 + Math.sin((t - 5.7) * Math.PI * 3) * .32 * envelope);
  }
  const animations = [...tracks].map(([name, values]) => {
    const [object, property] = name.split('/');
    return `<KeyedObject objectId="${object}"><KeyedProperty property="${property}">${values.map(([frame,value]) => `<KeyFrameDouble frame="${frame}" value="${value}" interpolationType="linear"/>`).join('')}</KeyedProperty></KeyedObject>`;
  }).join('\n');
  return `<Artboard id="${artboardId}" name="${name}" x="${reference ? 240 : 0}" width="183" height="224" styleId="${style}" defaultStateMachineId="${machine}">
    <LayoutComponentStyle id="${style}"/>
    ${reference ? '<Fill><SolidColor colorValue="FF0B1B2A"/></Fill>' : ''}
    ${content}
    <LinearAnimation name="Climb and greet" id="${entrance}" duration="636">${animations}
      <KeyedObject objectId="${constraints[1]}"><KeyedProperty property="strength"><KeyFrameDouble frame="0" value="1" interpolationType="hold"/><KeyFrameDouble frame="342" value="0" interpolationType="hold"/><KeyFrameDouble frame="582" value="1" interpolationType="hold"/></KeyedProperty></KeyedObject>
    </LinearAnimation>
    <LinearAnimation name="Seated idle" id="${idle}" duration="480" loopValue="loop">
      <KeyedObject objectId="${head}"><KeyedProperty property="rotation"><KeyFrameDouble frame="0" value="0"/><KeyFrameDouble frame="120" value="0"/><KeyFrameDouble frame="180" value="-.08"/><KeyFrameDouble frame="240" value="-.08"/><KeyFrameDouble frame="330" value=".08"/><KeyFrameDouble frame="390" value=".08"/><KeyFrameDouble frame="480" value="0"/></KeyedProperty></KeyedObject>
      <KeyedObject objectId="${face}"><KeyedProperty property="x"><KeyFrameDouble frame="0" value="0"/><KeyFrameDouble frame="120" value="0"/><KeyFrameDouble frame="180" value="-4"/><KeyFrameDouble frame="240" value="-4"/><KeyFrameDouble frame="330" value="1"/><KeyFrameDouble frame="390" value="1"/><KeyFrameDouble frame="480" value="0"/></KeyedProperty></KeyedObject>
    </LinearAnimation>
    <StateMachine name="Greeting" id="${machine}"><StateMachineLayer name="Once then seated">
      <EntryState><StateTransition stateToId="${entryState}"/></EntryState>
      <AnimationState x="200" id="${entryState}" animationId="${entrance}"><StateTransition stateToId="${idleState}" enableExitTime="true" exitTime="10600" duration="0"/></AnimationState>
      <AnimationState x="400" id="${idleState}" animationId="${idle}"/>
    </StateMachineLayer></StateMachine>
  </Artboard>`;
}
writeFileSync(new URL('scene.rml',import.meta.url), `<Rive version="1" kind="fragment"><ImageAsset id="0:1" name="X reference" file="x-reference.png"/>${artboard('Hero',false)}${artboard('Preview',true)}</Rive>\n`);
