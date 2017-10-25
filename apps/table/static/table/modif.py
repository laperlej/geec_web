import sys
import json

def main(filepath):
    file_names = {}
    content = json.load(open(filepath))
    for dataset in content["datasets"]:
        file_name = dataset["file_name"]
        while  file_name in file_names:
            #if filename ends with "_\d+$"
            f = file_name.split("_")
            if len(f) > 1 and f[-1].isdigit():
                f[-1] = str(int(f[-1]) + 1)
            else:
                f.append("1")
            file_name = "_".join(f)
        dataset["file_name"] = file_name
        file_names[file_name] = 1
    print json.dumps(content)



if __name__ == "__main__":
    FILEPATH = sys.argv[1]
    main(FILEPATH)
