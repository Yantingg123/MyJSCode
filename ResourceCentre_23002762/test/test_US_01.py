from inventory.inventory import inventory

class Test_US_01:
############### Test add camera ######################
   def test_add_camera(self):
       test_inventory = inventory()
       assert len(test_inventory.cameraList) == 0
       result = test_inventory.addCamera("C001", "Test camera 1", 5)
       assert result == True
       assert len(test_inventory.cameraList) == 1