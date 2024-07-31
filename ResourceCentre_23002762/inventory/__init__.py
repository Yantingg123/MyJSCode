class Camera():
# Refactor (E): Extract duplicate attributes and methods.
# There are several common attributes and methods in
# Camera.py and Laptop.py. Extract these common attributes
# and methods into a super class, named item.py
    def __init__(self, assetTag, description, opticalZoom):
       self._assetTag = assetTag
       self._description = description