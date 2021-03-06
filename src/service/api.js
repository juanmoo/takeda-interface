import axios from "axios";
import Collection from "../model/collection";
import React from "react";

const base_url = "http://rosetta6.csail.mit.edu:5000";

export class Service {
  collections = null;
  lastCollectionUpdated = null;

  updateCollectionList(callback) {
    const list_url = `${base_url}/list`;

    axios.get(list_url).then((res) => {
      let collectionList = [];
      res.data.collections.forEach((e) => {
        collectionList.push(
          new Collection(e.collection_name, e.document_names)
        );
      });

      callback(collectionList);
    });
  }

  getCollections(callback) {
    let d = new Date();
    let currentTime = d.getTime();

    if (
      this.lastCollectionUpdated == null ||
      currentTime - this.lastCollectionUpdated > 2000
    ) {
      this.updateCollectionList((colls) => {
        this.lastCollectionUpdated = d.getTime();
        this.collections = colls;
        callback(this.collections);
      });
    } else {
      callback(this.collections);
    }
  }
}

export function getCollectionList(callback) {
  const list_url = `${base_url}/list`;

  axios.get(list_url).then((res) => {
    let collectionList = [];
    res.data.collections.forEach((e) => {
      collectionList.push(new Collection(e.collection_name, e.document_names));
    });

    callback(collectionList);
  });
}
