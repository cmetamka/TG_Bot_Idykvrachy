# Copy blood story images. Run from project root.
$base = "C:\Users\Daniil\.cursor\projects\c-Prog-tgbot-vrach\assets\c__Users_Daniil_AppData_Roaming_Cursor_User_workspaceStorage_c8806826e8bbf340f5c3e1299a0ef06b"
$dst = "c:\Prog\tgbot_vrach\static\images\story-blood"
$map = @{
  1="images_1-8e85ad33-5810-45f4-bc12-fce43e20b487.png"; 2="images_2-a8768160-5674-4291-931e-22786a65a4ca.png"
  3="images_3-849f7712-3513-47a1-b243-7080c0e54915.png"; 4="images_4-d667bc04-e561-4d53-aa1f-046865487029.png"
  5="images_5-a64da8b6-4f57-4c87-8b5e-4a3f8c7c0948.png"; 6="images_6-b37db553-0c2d-483a-946f-9878924749f2.png"
  7="images_7-af9b69e2-973e-472c-a1e1-88851d194c88.png"; 8="images_8-9bd75015-ce2f-43ba-804c-ab767ec1ff23.png"
  9="images_9-fab2c783-4a40-470b-9b73-b6356d7b4d3b.png"; 10="images_10-2da03349-fe55-401d-a250-ef81b75a7584.png"
  11="images_11-d6bfdcd5-85b3-4c9a-b384-052746d45f1c.png"; 12="images_12-b1f82e72-92fb-4459-9416-09e624622867.png"
  13="images_13-483fd8de-afa3-43bf-9464-a365b4022783.png"; 14="images_14-fe4e905e-5af2-4d08-807d-a3f6d7345d9a.png"
  15="images_15-1e4de716-4a57-4758-bf11-39c87fb8b6ec.png"; 16="images_16-b824451f-e2d9-4e5f-8e01-de35bd4e44a4.png"
  17="images_17-95a7494c-fb23-4259-98d5-4b4436dd579c.png"; 18="images_18-8a7a76ea-8e3c-4748-9a84-e4406d8888ee.png"
  19="images_19-fec38b3b-f166-454c-93d5-f9c5523ebfef.png"; 20="images_20-556f3c4a-23c3-4270-b101-290b790f4ede.png"
  21="images_21-d4e5a2d8-115a-4cd0-9e21-49e9d8e676f4.png"; 22="images_22-40252d5a-a211-4541-af47-c2aded4acd12.png"
  23="images_23-8b503478-39a8-406e-a4e8-15ee0cd89dec.png"; 24="images_24-6188fbd6-c3b3-42f3-a09f-0c5650a76ccf.png"
  25="images_25-74daa582-aa65-49ec-afa8-bc20e16f4abe.png"; 26="images_26-2379a7d2-e311-429e-82ef-8ff5b4568777.png"
  27="images_27-3d6b996b-8fc8-4771-9de5-a41226206bca.png"; 28="images_28-06b2113f-0c8f-4315-820f-02b71a86f6a9.png"
}
New-Item -ItemType Directory -Force -Path $dst | Out-Null
foreach ($i in 1..28) {
  $src = Join-Path $base $map[$i]
  $n = $i.ToString("00")
  if (Test-Path $src) { Copy-Item $src "$dst\blood-slide-$n.png" -Force; Write-Host "OK: $n" } else { Write-Host "Missing: $src" }
}
