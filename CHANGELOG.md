# Beta 1 - Initial Release 12/02/15

## Beta 2 - 12/09/15
  - Popup maximizes automatically in mobile device under 415 pixels wide. (#95 & #97)

  - Instructions Overlay added. (#110)

  - Replaced placeholder photos with actual crossing photos in the report page. (#111 & #113)

  - Added favicon to index.html and report.html (#115)
  - Full Report link in popup now opens a new tab. This allows you to maintain your current extent in the map (index.html page). It also allows you to open up multiple tabs for different crossing reports and compare. (#115)
  - Added links to popup attachments to view full image in a new tab. (#115)
  - Increased max search suggestions. (#115)
  - Signs show up at very high zoom (#115)

  - Fixed popup scrolling issue that occurred when using a touchscreen device. Previously you could not view any content in the popup that overflowed the popup container if you were using an iphone or other touchscreen devices. (#118)

  - Added mile post layers to map. (#119)
  - Basemap now changes from 'topo' to 'streets' when zoomed in past level of detail (LOD) 11. (#119)
  - BasemapToggle button added that allows you to toggle 'satellite' imagery basemap on/off when zoomed in past LOD 11. (#119 #123)

  - Added help button that displays an instructions page. (#120)
  - Improved styling of navbar to be more responsible. (#120)
  - Remove search dropdown list. (#120)

  - Changed popup style to better match the lighter look of the topo map and navbar. (#122)

  - Changed the AADT symbology to distinguish the traffic data from railroad lines. (#128)
  - Added layer toggle option. Radio buttons provide the ability to toggle on/off AADT and Signs layers. (#128)

  - Created a LocateButton to locate and zoom to the users location. (#129)

  - Added warning text that explains when information and images don't load correctly in a popup. (#133)
  - Styled popup links to Full Report page and view full images. (#133)
  - Enabled Full Report link on signs popup to navigate to the crossing report related to the sign. (#133)


## Beta 3 - Released 12/17/2015
- Removed AADT Layer (#150, #126, #135)
- Removed Restore Button on popup when screen is less than 415 pixels wide. Also styled prev, next, close, and popup title for aesthetics and ease of use on a touchscreen (#149)
- Added the text "Help" under the symbol for the Help Button to make it more clear to users. Also made styling more responsive for Help Button (#148, #169, #157, #168)
- Added responsive Legend for desktop and mobile (#147, #146)
- Fixed bug for instructions page so that it loads correctly on iphone 4/5 (#145)
- Improved "Oops" text for popup so that it is more clear and concise (#161)
- Removed LayerToggle and BasemapToggle. Changed high-zoom basemap from streets to satellite imagery with world transportation reference layer for labels. (#131, #121, #162)
- Removed Rail Trails and Twin State RR from Railroad Lines layer as they are not associated with any public crossings. (#156)
- Changed JS code for loading popup info and images so that each popup loads the correct photos. Stopped photos from automatically loading in popup and added button to popup to load photos on request. Rotated sign photos 90 degrees so that the majority of the sign photos display with the correct orientation in popups. Previously photos were loading for the wrong crossing when network was slow. (#160, #98, #174)
- Added DOT Number label to crossings and fixed font issue for labels in different browsers (#140, #158)
