function imageGA() {
  //Google Analytics
  ga('send', 'event', { eventCategory: 'Pictures', eventAction: 'View Full Image', eventLabel: 'Report Page Full Image Link'});
}

var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

if (width < 1200) {
  document.getElementById("metadata-body").innerHTML = "Click or tap a grid cell for more information."
}


function onMouseEventOpen(y) {
  if (width > 1199) {
    displayMD(y);
  }
}

function onMouseEventClose(y) {
  if (width > 1199) {
    hideMD(y);
  }
}


function displayMD(x) {
  // Hides any metadata-domain or "Valid Entries" text set by previous
  // metadata queries
  document.getElementById("metadata-domain").style.display = "none";

  if (x.id === "xing-num") {
    document.getElementById("metadata-title").innerHTML = "Department of Transportation Crossing Number";
    document.getElementById("metadata-body").innerHTML = "This is the crossing ID number assigned by the Department of Transportation (DOT_Num), with the dash after the third character. Usually the DOT number is reported with the dash and this field allows for simple queries and joins in most situations. For crossings believed to be public that do not yet have a valid DOT number, this field has the unique ID given to the crossing by the crossing inspector in 2015. The format for these crossing ID’s is “NOT-####,” with the numbers increasing with each addition, starting with NOT-0001.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "surf-cond") {
    document.getElementById("metadata-title").innerHTML = "Overal Crossing Condition";
    document.getElementById("metadata-body").innerHTML = "The overall condition of the crossing. This is determined by the safety and comfort for vehicles and pedestrians crossing the tracks. It is important to note that while there was great consideration taken when rating these crossing conditions, it is a subjective rating system that can be influenced by a variety of factors.";
    document.getElementById("metadata-domain-text").innerHTML = "<ul><li><b>Poor: </b>Crossing has large potholes, gaps, exposed rail or differential surface height that force vehicles to slow down to near idling speed to avoid damage or concern. Crossing needs attention.</li><li><b>Fair: </b>The crossing requires a significant reduction in speed to avoid possible concern. Surface could exhibit potholes and/or large cracking, possibly exposed material or depressions. Enough evidence to suggest work should be done on the crossing.</li><li><b>Good: </b> The crossing contains minor cracking and miniscule to no potholes. Vehicles can travel over the surface with little to no reduction in speed. The surface is just about flush with the rails.</li><li><b>Excellent: </b>Crossing is in pristine condition, usually paved within the last year or two. Hairline fractures at the most are displayed here with a level surface spanning the entire crossing.</li></ul>";

    document.getElementById("metadata-domain").style.display = "block";

    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "feature-crossed") {
    document.getElementById("metadata-title").innerHTML = "Road Name";
    document.getElementById("metadata-body").innerHTML = "The Feature_Crossed is the transportation feature, highway or pathway, which crosses the railroad tracks at the crossing. For highways, the field is populated with name identified by the street sign at the site. When the street sign name matches the feature in TransRoad_RDS that intersects the rail line, Feature_Crossed is populated with the street name as it appears in the RDFLNAME attribute field of TransRoad_RDS. This allows easy identification of crossings that have conflicting data sources about highway name. Non-highway crossings are populated with “Pathway” first, and can include descriptive information afterward, if applicable. For example, a crossing for the Champlain Bikeway could have “Pathway – Champlain Bikeway” in the Feature_Crossed field.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "town") {
    document.getElementById("metadata-title").innerHTML = "Town";
    document.getElementById("metadata-body").innerHTML = "The town that the crossing is located within.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "rail-division") {
    document.getElementById("metadata-title").innerHTML = "Division";
    document.getElementById("metadata-body").innerHTML = "The division of the line for the railroad line section. Populated with the applicable Division for the railroad line in the crossing. LineName is the railroad management level above and Subdivision is the railroad management level below.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "rail-subdivision") {
    document.getElementById("metadata-title").innerHTML = "Subdivision";
    document.getElementById("metadata-body").innerHTML = "The subdivision of the line for the railroad line section. Populated with the applicable Subdivision for the railroad line in the crossing. Division is the railroad management level above and Branch is the railroad management level below.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "mile-post") {
    document.getElementById("metadata-title").innerHTML = "Mile Post";
    document.getElementById("metadata-body").innerHTML = "Similar to mile markers on state roads and highways, the railroad uses mile posts to mark the length of rail (in miles) from a starting hub. In the U.S. mile posts run from south to north and west to east. This is opposite of Canadian regulations which can be confusing due to the Canadian railroad lines that run inside Vermont borders. Mile posts generally reset at hubs marking new subdivisions or operators. Each crossing has a mile posting in the inventory and databases though there may not be a physical post at the site. These mile posts are occasionally stenciled onto certain crossing features or included on ENS or DOT Number signs.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "surf-type") {
    document.getElementById("metadata-title").innerHTML = "Main Surface Material";
    document.getElementById("metadata-body").innerHTML = "Indicates the material that covers the majority, or all, of the surface area of the crossing. This flange material is not considered part of the crossing surface material.";
    document.getElementById("metadata-domain-text").innerHTML = "<ul><li><b>Asphalt: </b>Asphalt is the most commonly used material for crossing surfaces.</li><li><b>Composite: </b>An engineered material formed from two or more distinct materials generally incorporating a polymer binder with reinforcing fibers and/or fillers to contribute enhanced properties and/or other property modifiers in a polymer matrix that are usually individually installed and removable for maintenance and replacement purposes.</li><li><b>Concrete: </b>Concrete slab, or concrete pavement, surface over the crossing area. Typically pre-cast sections that are removable for maintenance and replacement purposes.</li><li><b>Metal: </b>Sections of steel or other metal that cover the crossing area.</li><li><b>Rubber: </b>Typically preformed rubber sections that are removable for maintenance and replacement purposes.</li><li><b>Timber: </b>Sectional treated timber or full wood plank that covers the crossing area.</li><li><b>Unconsolidated: </b>Ballast, dirt, gravel, or other unconsolidated material placed over crossing area.</li><li><b>Other: </b> Any surface material not previously described.</li></ul>";

    document.getElementById("metadata-domain").style.display = "block";

    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "surf-type-two") {
    document.getElementById("metadata-title").innerHTML = "Secondary Surface Type";
    document.getElementById("metadata-body").innerHTML = "If more than one material cover the surface of the crossing area, SurfaceType2 indicates the material that covers the minority of the surface area of the crossing. Again, flange material is not considered part of the crossing surface material and should not be recorded in this field. If the SurfaceType (Primary Crossing Surface) material covers the entire crossing area, this field is left null.";
    document.getElementById("metadata-domain-text").innerHTML = "<ul><li><b>Asphalt: </b>Asphalt is the most commonly used material for crossing surfaces.</li><li><b>Composite: </b>An engineered material formed from two or more distinct materials generally incorporating a polymer binder with reinforcing fibers and/or fillers to contribute enhanced properties and/or other property modifiers in a polymer matrix that are usually individually installed and removable for maintenance and replacement purposes.</li><li><b>Concrete: </b>Concrete slab, or concrete pavement, surface over the crossing area. Typically pre-cast sections that are removable for maintenance and replacement purposes.</li><li><b>Metal: </b>Sections of steel or other metal that cover the crossing area.</li><li><b>Rubber: </b>Typically preformed rubber sections that are removable for maintenance and replacement purposes.</li><li><b>Timber: </b>Sectional treated timber or full wood plank that covers the crossing area.</li><li><b>Unconsolidated: </b>Ballast, dirt, gravel, or other unconsolidated material placed over crossing area.</li><li><b>Other: </b> Any surface material not previously described.</li></ul>";

    document.getElementById("metadata-domain").style.display = "block";

    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "snooper") {
    document.getElementById("metadata-title").innerHTML = "Snooper Compliant";
    document.getElementById("metadata-body").innerHTML = "Attempts to identify crossings that are compliant with the VTrans Bridge Inspection Teams Snooper truck. Rail joints can destroy the expensive tires of the Snooper. This field identifies crossings that have rail joints within 5 feet of either side of the crossing surface with a value of No. The bridge team can use this field, in addition to XingLength and XingCond data, to determine which crossing, near the bridge of interest, is best suited for the Snooper to safely enter the rail tracks.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "flange-material") {
    document.getElementById("metadata-title").innerHTML = "Flange Material";
    document.getElementById("metadata-body").innerHTML = "Indicates the material used to form flangeway openings. Some crossings do not have any flange material protecting the flangeway opening from debris.";
    document.getElementById("metadata-domain-text").innerHTML = "<ul><li><b>Rail: </b>Old rail line or “mudrail” placed next to the track to create a flangeway opening.</li><li><b>Rubber: </b>Rubber flangeway material typically specifically molded for the purpose of creating a flangeway opening.</li><li><b>Timber: </b>Timber placed next to track to create a flangeway opening.</li><li><b>Other: </b>Other types of material, not specified above, placed next to track to create a flangeway opening.</li></ul>";

    document.getElementById("metadata-domain").style.display = "block";

    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "number-tracks") {
    document.getElementById("metadata-title").innerHTML = "Number of Tracks";
    document.getElementById("metadata-body").innerHTML = "The number of tracks that cross the roadway or pathway at the crossing location. Must all apply to the same DOT Crossing Number.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "crossing-angle") {
    document.getElementById("metadata-title").innerHTML = "Crossing Angle";
    document.getElementById("metadata-body").innerHTML = "The range that includes the angle of that most closely describes the smallest angle created between the roadway/pathway and the track.";
    document.getElementById("metadata-domain-text").innerHTML = "<ul><li>0 - 29</li><li>30 - 59</li><li>60 - 90</li></ul>";

    document.getElementById("metadata-domain").style.display = "block";

    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "crossing-width") {
    document.getElementById("metadata-title").innerHTML = "Crossing Width";
    document.getElementById("metadata-body").innerHTML = "The width of the crossing surface. Measured in feet perpendicular to the railroad tracks and is the distance between the outermost edges of the crossing surface (including multiple tracks if present). In the event that the crossing surface is indistinguishable from the roadway approach, the width is the distance between the outermost rails of the crossing plus 4 feet.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "crossing-length") {
    document.getElementById("metadata-title").innerHTML = "Crossing Length";
    document.getElementById("metadata-body").innerHTML = "The length of the crossing surface. Measure in feet parallel to the tracks, along the improved surface of the crossing, which may extend beyond the edges of highway pavement and any sidewalks that may be present. In general, the crossing surface material extends approximately 3 feet on either side of the roadway/pathway.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "warning-device-code") {
    document.getElementById("metadata-title").innerHTML = "Warning Device Level";
    document.getElementById("metadata-body").innerHTML = "Every time a railroad meets a roadway, the MUTCD requires the crossing to have some sort of warning device to alert oncoming traffic of the crossing. The type of warning device(s) used depends on several factors including road geometry, highway speeds, railway speeds, traffic levels, and location. All required devices, signs and features for each type of crossing are detailed in the MUTCD chapter 8. This field was created in accordance with the old FRA Crossing Inventory Form. While the new FRA Crossing Inventory Form requires a greater level of detail in regards to warning devices, this field was kept as a useful tool to list and organize the database by levels of safety features.";
    document.getElementById("metadata-domain-text").innerHTML = "<ul><li>No signs or signals</li><li>Other signs or signals</li><li>Crossbucks</li><li>Stop or Yield</li><li>Other Active Warning Device (flagging)</li><li>Flashing Lights</li><li>1 - 3 Gates</li><li>Four Quad (full barrier) Gates</li></ul>";
    document.getElementById("metadata-domain").style.display = "block";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "channelization") {
    document.getElementById("metadata-title").innerHTML = "Channelization";
    document.getElementById("metadata-body").innerHTML = "Channelization occurs when a traffic separation system is present that directs traffic in a particular direction using raised longitudinal channelizers. A median refers to a more substantial traffic separation system that is non-traversable and completely separates traffic travelling in opposite directions. When gates are present, these devices can prevent cars from moving into the other side of the road in order to drive around a lowered gate. These devices provide additional automobile safety at gated crossings.";
    document.getElementById("metadata-domain-text").innerHTML = "<ul><li><b>All Approaches:</b> All approaches contain some form of a channelization device.</li><li><b>One Approach:</b> One approach contains some form of a channelization device.</li><li><b>Median:</b> A median completely separates traffic lanes travelling in opposite directions.</li><li><b>None:</b> No channelization devices or medians present at the crossing.</li></ul>";
    document.getElementById("metadata-domain").style.display = "block";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "illuminated") {
    document.getElementById("metadata-title").innerHTML = "Crossing Illumination";
    document.getElementById("metadata-body").innerHTML = "Indicates whether or not the crossing is illuminated by overhead street lighting that provides reasonable illumination of trains present at the crossing. The distance that an overhead light can be away from the crossing varies with the intensity of the light bulb. As the crossings were inspected during the day, it was assumed that any crossings, within 50 feet of an overhead street light, received adequate lighting and were considered illuminated.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "paved") {
    document.getElementById("metadata-title").innerHTML = "Paved";
    document.getElementById("metadata-body").innerHTML = "Identifies crossings located on highways or pathways that are paved with material on which pavement markings can be effectively maintained. The entire roadway does not need to be paved but the paved section must extend far enough to be able to accept pavement markings, typically about 100 feet.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "stop-line") {
    document.getElementById("metadata-title").innerHTML = "Stop Line";
    document.getElementById("metadata-body").innerHTML = "A stop line is a pavement marking that indicates the point behind which highway vehicles are or might be required to stop. They are typically a white solid line on the pavement, perpendicular to the line of traffic, and located approximately 8 feet upstream of the gate or signal.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "rr-pave-mark") {
    document.getElementById("metadata-title").innerHTML = "Railroad Pavement Markings";
    document.getElementById("metadata-body").innerHTML = "Pavement markings in the form of a white railroad crossing symbol that warns oncoming vehicles or pedestrians of the railroad crossing.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "pave-mark-cond") {
    document.getElementById("metadata-title").innerHTML = "Pavement Marking Condition";
    document.getElementById("metadata-body").innerHTML = "The overall condition of the pavement markings. This is determined wear of the paint and the resulting visibility of the markings. It is important to note that it is a subjective rating system that can be influenced by a variety of factors.";
    document.getElementById("metadata-domain-text").innerHTML = "<ul><li><b>Not Applicable:</b> There are no pavement markings at the crossing to apply a condition to.</li><li><b>OK:</b> Pavement markings are in good enough condition to be effective.</li><li><b>Worn:</b> Pavement markings are worn to the point of being ineffective.</li></ul>";
    document.getElementById("metadata-domain").style.display = "block";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "gates-road") {
    document.getElementById("metadata-title").innerHTML = "Gates (Road)";
    document.getElementById("metadata-body").innerHTML = "The number of protective gates for the railroad crossing that block the roadway when in the down position.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "gates-ped") {
    document.getElementById("metadata-title").innerHTML = "Gates (Ped)";
    document.getElementById("metadata-body").innerHTML = "The number of protective gates for the railroad crossing that block a bike or pedestrian pathway when in the down position.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "gate-config") {
    document.getElementById("metadata-title").innerHTML = "Gate Configuration";
    document.getElementById("metadata-body").innerHTML = "The basic configuration of the gates present at gate protected crossings. The GateConfig1 does not necessarily equal the sum of Roadway Gate Arms and BikePed Gate Arms. See domain details for further information.";
    document.getElementById("metadata-domain-text").innerHTML = "<ul><li><b>2 Quad:</b> Gate configuration featuring gates only on entrance lanes leading onto the crossing. A gated crossing on a one-way street is to be considered a 2 Quade gate configuration.</li><li><b>3 Quad:</b> Specific configuration with gates on all entrance lanes and one exit lane.</li><li><b>4 Quad:</b> Specific configuration with gates on all entrance and exit lanes.</li><li><b>None: </b>No gates.</li></ul>";
    document.getElementById("metadata-domain").style.display = "block";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "cant-struc-over") {
    document.getElementById("metadata-title").innerHTML = "Cantilevered Masts Over Road";
    document.getElementById("metadata-body").innerHTML = "The number of cantilevered or bridged flashing light structures that extend over the road. This is the number of structures, not the number of flashing light pairs.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "cant-struc-side") {
    document.getElementById("metadata-title").innerHTML = "Cantilevered Mast Beside Road";
    document.getElementById("metadata-body").innerHTML = "The number of cantilevered or bridged flashing light structures that do not extend over the road. This is the number of structures, not the number of flashing light pairs. Examples would be a cantilevered structure that extends over a pathway or road shoulder but terminates before the roadway travel lanes.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "cant-bulb-type") {
    document.getElementById("metadata-title").innerHTML = "Cantilevered Bulbs";
    document.getElementById("metadata-body").innerHTML = "The type of light bulb present in the flashing light pairs located on cantilevered or bridged flashing light structures.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "basic-mast-count") {
    document.getElementById("metadata-title").innerHTML = "Mast Count (Not Cantilevered)";
    document.getElementById("metadata-body").innerHTML = "The number of mast-mounted flashing light structures that are not cantilevered or bridged. This is the number of structures, not the number of flashing light pairs.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "mast-bulb-type") {
    document.getElementById("metadata-title").innerHTML = "Mast Bulbs";
    document.getElementById("metadata-body").innerHTML = "The type of light bulb present in the flashing light pairs located on mast-mounted flashing light structures.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "back-side-fl") {
    document.getElementById("metadata-title").innerHTML = "Back or Side Flashers";
    document.getElementById("metadata-body").innerHTML = "Identifies the presence of flashing light pairs that face backwards or to the side of the main approaches to the crossing. A side flashing light pair could face a driveway or side street that also approaches the crossing. A back flashing light pair is typically back to back with a front flashing light pair and can be seen on the left side of the roadway for oncoming traffic.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "flasher-count") {
    document.getElementById("metadata-title").innerHTML = "Total Flasher Pair Count";
    document.getElementById("metadata-body").innerHTML = "The total number of flashing light pairs installed at the crossing, including back lights, side lights, and where cantilever structures are present.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "flasher-size") {
    document.getElementById("metadata-title").innerHTML = "Flasher Bulb Size";
    document.getElementById("metadata-body").innerHTML = "The size of flashing light bulbs present. These are typically 8 or 12 inches.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "bell-count") {
    document.getElementById("metadata-title").innerHTML = "Bell Count";
    document.getElementById("metadata-body").innerHTML = "The number of bells present at the railroad crossing.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "traffic-lane-type") {
    document.getElementById("metadata-title").innerHTML = "Traffic Lane Type";
    document.getElementById("metadata-body").innerHTML = "The direction of vehicular travel along the Feature_Crossed for highway crossings.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "traffic-lane-count") {
    document.getElementById("metadata-title").innerHTML = "Traffic Lane Count";
    document.getElementById("metadata-body").innerHTML = "The number of through traffic lanes crossing the track. This does not include shoulders or lanes that are used for parking.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "hts-nearby-int") {
    document.getElementById("metadata-title").innerHTML = "Traffic Signal Nearby";
    document.getElementById("metadata-body").innerHTML = "Indicates the presence of a highway-highway intersection that has highway traffic signals within 500 feet of the nearest rail.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "int-road") {
    document.getElementById("metadata-title").innerHTML = "Intersection Nearby (Less 500 ft)";
    document.getElementById("metadata-body").innerHTML = "Indicates whether or not the street or highway for the crossing is intersected by another street or highway within 500 feet of the crossing.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "int-road-distance") {
    document.getElementById("metadata-title").innerHTML = "Distance to Intersection";
    document.getElementById("metadata-body").innerHTML = "The distance in feet between the crossing and the nearest intersecting roadway. This is only applicable if IntRd500 equals Yes.";
    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "road-funcl") {
    document.getElementById("metadata-title").innerHTML = "Functional Classification";
    document.getElementById("metadata-body").innerHTML = "The FUNCL, or Functional Classification, of the TransRoad_RDS feature that intersects the rail line at the crossing feature location.";
    document.getElementById("metadata-domain-text").innerHTML = "<ul><li>Interstate</li><li>Principal Arterial</li><li>Minor Arterial</li><li>Major Collector</li><li>Minor Collector</li><li>Local</li><li>No Functional Classification</li><li>Unknown</li></ul>";

    document.getElementById("metadata-domain").style.display = "block";

    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "road-aot") {
    document.getElementById("metadata-title").innerHTML = "AOT Classification";
    document.getElementById("metadata-body").innerHTML = "The AOTCLASS, or Agency of Transportation road classification, of the TransRoad_RDS feature that intersects the rail line at the crossing feature location.";
    document.getElementById("metadata-domain-text").innerHTML = "<ul><li>US Highway</li><li>State Highway</li><li>Class 1 Town Highway</li><li>Class 2 Town Highway</li><li>Class 3 Town Highway</li><li>Class 4 Town Highway</li><li>Private Road</li><li>Legal Trail</li><li>Unknown</li></ul>";

    document.getElementById("metadata-domain").style.display = "block";

    document.getElementById("metadata-info").style.display = "block";
  }
  else if (x.id === "comments") {
    document.getElementById("metadata-title").innerHTML = "General Comments";
    document.getElementById("metadata-body").innerHTML = "For many of the crossings there was additional information that seemed valuable that did not fit into the other attribute fields.  This information was accounted for in Comments.  The most common comments pertained to the cause of the crossing condition rating, multiple material descriptions, degradation of surface materials, or various other oddities.";
    document.getElementById("metadata-info").style.display = "block";
  }
}
function hideMD() {
  document.getElementById("metadata-title").innerHTML = "Metadata";
  document.getElementById("metadata-body").innerHTML = "Place your mouse over (or tap) a grid cell to display the data attribute explanation.";
  document.getElementById("metadata-domain").style.display = "none";
}
function closeMD() {
  document.getElementById("metadata-info").style.display = "none";
}
