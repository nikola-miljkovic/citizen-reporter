import numpy as np
import scipy as sp
import matplotlib as plt
import json
import requests
import facebook
import indicoio
import pickle

from sklearn.cross_validation import train_test_split
from sklearn.linear_model import LogisticRegression

indicoio.config.api_key = "bca760a95d156cbbad4729cb9cd4cb0e"
my_access_token = "EAACEdEose0cBAIcqBq4yCC1WZCEKiNGnzH4dZAv8PDKJS6kMH5VctNTGT2wwqMQZBmwmGlak03aZATBHcNwZBCX8KqH0CX6J11ZCCKocomKfFpezjX9ifj3lB0i8aeZApjMnHlEIkiIWdPiyV2TlKbw2rr33U6SibOKoPWiksawmgZDZD"

users = ["ladygaga", "leonardodicaprio"]
clf = [LogisticRegression(), LogisticRegression(), LogisticRegression()]
for i in range(0, len(clf)):
    graph = facebook.GraphAPI(access_token=my_access_token, version='2.6')
    posts = graph.get_object("/" + users[i] + "/" + 'posts', limit=100)
    factorization_matrix = np.zeros(shape=[111, len(posts["data"])])
    matrix_classes = np.zeros(shape=[1, len(posts["data"])])
    for j in range(0, len(posts["data"])):
        if 'message' in posts["data"][j]:
            item = posts["data"][j]
            payload = {'texts': [item["message"]]}
            response = requests.post("https://api.uclassify.com/v1/uClassify/Sentiment/classify",
                                     data=json.dumps(payload), headers={'Authorization': 'Token JbHwzZBLH1ke'})
            prediction = response.json()[0]
            text_tags = indicoio.text_tags(item["message"], version=2)
            predicted_class = 0
            if prediction["classification"][0]["p"] > prediction["classification"][1]["p"]:
                predicted_class = 0
            else:
                predicted_class = 1

            matrix_classes[:, j] = predicted_class
            factorization_matrix[:, j] = list(text_tags.values())

    X_train, X_test, y_train, y_test = train_test_split(factorization_matrix.T, matrix_classes.T, test_size=0.2)
    clf[i].fit_transform(X_train, y_train)
    y_predict = clf[i].predict(X_test)
    print("Y_test shape = ", y_test.shape)
    print("Y_preidct shape = ", y_predict.shape)

    true_positives = 0
    for k in range(0, len(y_test)):
        if y_test[k] == y_predict[k]:
            true_positives += 1

    print("Accuracy = ", true_positives / y_test.shape[0])

    with open("classifier" + str(i) + ".pickle", "wb") as output_file:
        pickle.dump(clf[i], output_file)

