---
title: MinIO 对象存储
date: 2023/04/28
---

## MinIO 对象存储

### 1.MinIO 安装

Minio 是个基于 Golang 编写的开源对象存储套件，虽然轻量，却拥有着不错的性能。

- 官网地址：[MinIO | High Performance, Kubernetes Native Object Storageopen in new window](https://min.io/)
- 官网文档地址：[MinIO | The MinIO Quickstart Guideopen in new window](https://docs.min.io/)
- 官网文档（ 中文 ）地址：[官网中文网址open in new window](http://docs.minio.org.cn/docs/) 中文文档对应的是上个版本，新版本中有些内容已发生了变化，所以最好是看英文文档。
- JAVA SDK API：[minio java sdk api 文档](https://docs.min.io/docs/java-client-api-reference.html)

> 何为对象存储？
>
> 对象存储服务（ Object Storage Service，OSS ）是一种海量、安全、低成本、高可靠的云存储服务，适合存放任意类型的文件。容量和处理能力弹性扩展，多种存储类型供选择，全面优化存储成本。

对于中小型企业，如果不选择存储上云，那么 Minio 是个不错的选择，麻雀虽小，五脏俱全

#### CentOS7安装

##### 1.下载MinIO，并创建目录

> 在usr/local下创建minio文件夹，并在minio文件里面创建bin和data目录，把下载好的minio文件拷贝到bin目录里面

~~~shell
mkdir /usr/local/minio && cd /usr/local/minio && mkdir bin data
wget https://dl.min.io/server/minio/release/linux-amd64/minio bin
~~~

##### 2.赋予它可执行权限  

> 在 /usr/local/minio 执行

~~~shell
chmod +x bin/minio
~~~

##### 3.前台运行 (可跳过)

> 可执行 4 5 步 后台运行

~~~shell
./bin/minio server ./data
~~~

##### 4.将 minio 添加成服务

> Linux 的服务: 相对于开机自启 且 可以使用 5 后台运行

~~~shell
cat > /etc/systemd/system/minio.service << EOF
[Unit]
Description=Minio
Wants=network-online.target
After=network-online.target
AssertFileIsExecutable=/usr/local/minio/bin/minio

[Service]
WorkingDirectory=/usr/local/minio/
PermissionsStartOnly=true
ExecStart=/usr/local/minio/bin/minio server /usr/local/minio/data
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF
~~~

##### 5.使用systemctl 启停 minio

~~~shell
systemctl start minio   ## 启动
systemctl stop minio    ## 停止
~~~

* MinIO Server 成功启动后访问 [http://192.168.128.128:9000]

* 输入用户名/密码 `minioadmin/minioadmin` 可以进入 web 管理系统

* 刚打开的时候，是没有bucket桶，可以手动或者通过java代码来创建一个桶。

> 创建的桶默认的权限时private私有的，外部不能访问，你可以修改桶的属性，点击manage，找到Access Policy，修改权限为public即可。

![image-20220730120529621](https://apaiimages.oss-cn-guangzhou.aliyuncs.com/MD/image-20220730120529621.png)



#### Docker安装

##### 拉取 minio 镜像

```java
// minio 文件对象存储 类似阿里云oss
docker pull minio/minio 
```

##### 创建 minio 容器

* --console-address ":9000" 表示minio的 前端页面的端口
* --address ":9090" 表示minio的文件上传API 的端口 | 在yml 需配置 9090

~~~shell
docker run -id --name=minio -p 9000:9000 -p 9090:9090 -e "MINIO_PROMETHEUS_AUTH_TYPE=public" \
-e "MINIO_ROOT_USER=minioadmin" -e "MINIO_ROOT_PASSWORD=minioadmin" \
-v /mnt/minio/data:/data -v /mnt/minio/config:/root/.minio minio/minio server /data \
--console-address ":9000" --address ":9090"
~~~

> --console-address ":9000" --address ":9090"  docker使用静态的固定端口，以避免启动时使用随机端口

浏览器访问：192.168.128.128:9000



## MinIO Java SDK 测试

### 1.引入相关依赖

~~~xml
<dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp</artifactId>
    <version>4.8.1</version> <!-- minio 依赖于 okhttp 且版本较高。注意，spring-boot-dependencies 中的不够高 -->
</dependency>
<dependency>
    <groupId>io.minio</groupId>
    <artifactId>minio</artifactId>
    <version>8.3.9</version>
</dependency>
~~~

### 2.测试

~~~java
@SpringBootTest
class DemoApplicationTests {
    @Test
    public void demo() throws Exception {

        // 使用 MinIO 服务的 URL 和端口，Access key 和 Secret key 创建一个 MinioClient 对象。
        MinioClient minioClient = MinioClient.builder()
                .endpoint("http://127.0.0.1:9000")
                .credentials("minioadmin", "minioadmin")
                .build();

        // 检查存储桶是否已经存在
        boolean isExist = minioClient.bucketExists(BucketExistsArgs.builder().bucket("kongming").build());
        if (isExist) {
            System.out.println("Bucket already exists.");
        } else {
            // 创建一个名为 asiatrip 的存储桶，用于存储文件。
            minioClient.makeBucket(MakeBucketArgs.builder().bucket("kongming").build());
        }

        // 使用 putObject 上传一个文件到存储桶中。
        File file = new File("e:/BluceLee/1.jpg");
        InputStream inputStream = new FileInputStream(file);

        PutObjectArgs args = PutObjectArgs.builder()
                .bucket("kongming")
                .object("xiaolong.jpg")
                .contentType("image/jpg")
                .stream(inputStream, inputStream.available(), -1)
                .build();

        minioClient.putObject(args);
        System.out.println("  successfully uploaded as xiaolong.png to `kongming` bucket.");
	}
}
~~~

## Springboot 整合 MinIO

### 1.引入依赖

~~~xml
 <dependency>
     <groupId>com.squareup.okhttp3</groupId>
     <artifactId>okhttp</artifactId>
     <version>4.8.1</version> <!-- minio 依赖于 okhttp 且版本较高。注意，spring-boot-dependencies 中的不够高 -->
</dependency>
<dependency>
    <groupId>io.minio</groupId>
    <artifactId>minio</artifactId>
    <version>8.3.9</version>
</dependency>
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.70</version>
</dependency>

--- 使用网页跳转可添加 ---
<!--thymeleaf 启动器 - thymeleaf专属依赖-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
~~~

### 2.相关配置

~~~yaml
server:
  port: 8081
spring:
  application:
    name: demo
  servlet:
    multipart:
      max-file-size: 200MB  #设置单个文件的大小  因为springboot内置tomact的的文件传输默认为10MB
      max-request-size: 500MB   #设置单次请求的文件总大小
      enabled: true    #千万注意要设置该参数，否则不生效
## minio 文件存储配置信息
minio:
  endpoint: http://192.168.128.128:9000
  accesskey: minioadmin
  secretKey: minioadmin
~~~

### 3.minio配置类和配置属性

> 在 config 配置类 配置这两个类

~~~java
@Data
@Component
@ConfigurationProperties(prefix = "minio")
public class MinioProp {
    private String endpoint;
    private String accesskey;
    private String secretKey;
}
=============================================
@Configuration
@EnableConfigurationProperties(MinioProp.class)
public class MinioConfig {
    @Autowired
    private MinioProp minioProp;
    @Bean
    public MinioClient minioClient() throws Exception {
       return MinioClient.builder().endpoint(minioProp.getEndpoint())
               .credentials(minioProp.getAccesskey(), minioProp.getSecretKey()).build();
    }
}
~~~

### 4.编写简单文件上传工具类

> Util 工具类下
>
> 文件上传的工具类 在表现层调用上传成功之后返回 图片地址和状态码

**图片地址** 

* 直接访问为下载  

* 可以 img 标签进行显示 

~~~java
@Slf4j
@Component
public class MinioUtils {

    @Autowired
    private MinioClient client;
    @Autowired
    private MinioProp minioProp;
   
    /**
     * 创建bucket
     */
    public void createBucket(String bucketName) {
        BucketExistsArgs bucketExistsArgs = BucketExistsArgs.builder().bucket(bucketName).build();
        MakeBucketArgs makeBucketArgs = MakeBucketArgs.builder().bucket(bucketName).build();
        try {
            if (client.bucketExists(bucketExistsArgs))
                return;
            client.makeBucket(makeBucketArgs);
        } catch (Exception e) {
            log.error("创建桶失败：{}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    /**
     * @param file       文件
     * @param bucketName 存储桶
     * @return
     */
    public JSONObject uploadFile(MultipartFile file, String bucketName) throws Exception {
        JSONObject res = new JSONObject();
        res.put("code", 0);
        // 判断上传文件是否为空
        if (null == file || 0 == file.getSize()) {
            res.put("msg", "上传文件不能为空");
            return res;
        }
        // 判断存储桶是否存在
        createBucket(bucketName);
        // 文件名
        String originalFilename = file.getOriginalFilename();
        // 新的文件名 = 存储桶名称_时间戳.后缀名
        String fileName = bucketName + "_" + System.currentTimeMillis() +                              									originalFilename.substring(originalFilename.lastIndexOf("."));
        // 开始上传
        InputStream inputStream = file.getInputStream();
        PutObjectArgs args = PutObjectArgs.builder().bucket(bucketName).object(fileName)
                .stream(inputStream,inputStream.available(),-1).build();
        client.putObject(args);
        res.put("code", 1);
        res.put("msg", minioProp.getEndpoint() + "/" + bucketName + "/" + fileName);
        return res;
    }
}
~~~

### 5.controller层测试

```java
package com.apai.controller;


import com.alibaba.fastjson.JSONObject;
import com.apai.util.MinioUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class FileController {

    @Autowired
    private MinioUtils minioUtils;

    @GetMapping("/gotofile")
    public String file() {
        return "miniofile";
    }

    @PostMapping("/uploadimg")
    @ResponseBody
    public String uploadimg(@RequestParam(name = "file", required = false) MultipartFile file) {
        JSONObject res = null;
        try {
            // 在调用文件上传工具类时 注意 桶 的名称
            res = minioUtils.uploadFile(file, "桶名");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("code", 0);
            res.put("msg", "上传失败");
        }
        return res.toJSONString();
    }

}
```

~~~java
@PostMapping("/uploadimg")
@ResponseBody
public String uploadimg(@RequestParam(name = "file", required = false) MultipartFile file,
                     HttpServletRequest request) {
    JSONObject res = null;
    try {
        res = minioUtils.uploadFile(file, "kongming");
    } catch (Exception e) {
        e.printStackTrace();
        res.put("code", 0);
        res.put("msg", "上传失败");
    }
    return res.toJSONString();
}

@PostMapping("/uploadvideo")
@ResponseBody
public String uploadvideo(@RequestParam(name = "file", required = false) MultipartFile file,
                      HttpServletRequest request) {
    JSONObject res = null;
    try {
        res = minioUtils.uploadFile(file, "kongming");
    } catch (Exception e) {
        e.printStackTrace();
        res.put("code", 0);
        res.put("msg", "上传失败");
    }
    return res.toJSONString();
}
~~~

### 6.页面编写，上传视频和图片

~~~html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>首页</title>
</head>
<body>
<center>
    <form accept-charset="UTF-8" th:action="@{uploadimg}" method="post"
          enctype="multipart/form-data" target="_blank"> 
        文件:<input type="file" name="file"/>
        <input type="submit" value="上传"/> 
    </form>
</center>
</body>
</html>
=================================================================
<form accept-charset="UTF-8" th:action="@{uploadvideo}" method="post"
      enctype="multipart/form-data" target="_blank"> 
    文件:<input type="file" name="file"/>
    <input type="submit" value="上传"/> 
</form>
~~~

注意：上传完成后，返回的url地址为：http://服务ip:端口/桶名称/文件名

### 7.放入标签显示

~~~html
<img src = "http://192.168.128.128:9000/kongming/kongming_1652184296820.jpg" />
<br/>
<video width="1120" height="540" controls="controls" id="video" preload="auto"     >
 <source src="http://192.168.128.128:9000/kongming/kongming_1652234547469.mp4" type="video/mp4">
</video>
~~~



### 附录完整工具类

~~~java
package com.woniu.util;

import io.minio.*;
import io.minio.errors.*;
import io.minio.http.Method;
import io.minio.messages.*;
// import net.minidev.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class MinioUtils1 {

    private static final Logger log = LoggerFactory.getLogger(MinioUtils1.class);

    private final String endpoint;
    private final String accessKey;
    private final String secretKey;

    private MinioClient minioClient;

    public MinioUtils1(String endpoint, String accessKey, String secretKey) {
        this.endpoint = endpoint;
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.minioClient = MinioClient.builder().endpoint(endpoint).credentials(accessKey, secretKey).build();
    }

/*
    @PostConstruct
    private MinioClient client() {
    }
*/

    public boolean doesBucketExists(String bucketName) {
        BucketExistsArgs args = BucketExistsArgs.builder()
                .bucket(bucketName)
                .build();
        try {
            return minioClient.bucketExists(args);
        } catch (ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | IOException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            throw new RuntimeException(e);
        }
    }


    /**
     * 创建 bucket
     *
     * @param bucketName 桶名
     */
    public void createBucket(String bucketName) {
        BucketExistsArgs bucketExistsArgs = BucketExistsArgs.builder().bucket(bucketName).build();
        MakeBucketArgs makeBucketArgs = MakeBucketArgs.builder().bucket(bucketName).build();

        try {
            if (minioClient.bucketExists(bucketExistsArgs))
                return;

            minioClient.makeBucket(makeBucketArgs);
        } catch (Exception e) {
            log.error("创建桶失败：{}", e.getMessage());
            throw new RuntimeException(e);
        }
    }


    /**
     * 判断文件是否存在
     *
     * @param bucketName 存储桶
     * @param objectName 对象
     * @return true：存在
     */
    public boolean doesObjectExist(String bucketName, String objectName) {
        StatObjectArgs args = StatObjectArgs.builder().bucket(bucketName).object(objectName).build();
        try {
            minioClient.statObject(args);
        } catch (Exception e) {
            return false;
        }
        return true;
    }


    /**
     * 判断文件夹是否存在
     *
     * @param bucketName 存储桶
     * @param objectName 文件夹名称（去掉/）
     * @return true：存在
     */
    public boolean doesFolderExist(String bucketName, String objectName) {
        ListObjectsArgs args = ListObjectsArgs.builder()
                .bucket(bucketName)
                .prefix(objectName)
                .recursive(false)
                .build();
        boolean exist = false;
        try {
            Iterable<Result<Item>> results = minioClient.listObjects(args);
            for (Result<Item> result : results) {
                Item item = result.get();
                if (!item.isDir())
                    continue;

                if (objectName.equals(item.objectName())) {
                    exist = true;
                }
            }
        } catch (Exception e) {
            exist = false;
        }
        return exist;
    }


    /**
     * 通过 MultipartFile ，上传文件
     *
     * @param bucketName 存储桶
     * @param file       文件
     * @param objectName 对象名
     */
    public ObjectWriteResponse putObject(String bucketName, MultipartFile file, String objectName, String contentType) {
        try {
            InputStream inputStream = file.getInputStream();
            PutObjectArgs args = PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectName)
                    .contentType(contentType)
                    .stream(inputStream, inputStream.available(), -1)
                    .build();
            return minioClient.putObject(args);
        } catch (ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | IOException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 上传本地文件
     *
     * @param bucketName 存储桶
     * @param objectName 对象名称
     * @param fileName   本地文件路径
     */
    public ObjectWriteResponse putObject(String bucketName, String objectName, String fileName) {
        try {
            UploadObjectArgs args = UploadObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectName)
                    .filename(fileName)
                    .build();
            return minioClient.uploadObject(args);
        } catch (ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | IOException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 通过流上传文件
     *
     * @param bucketName  存储桶
     * @param objectName  文件对象
     * @param inputStream 文件流
     */
    public ObjectWriteResponse putObjectByStream(String bucketName, String objectName, InputStream inputStream) {
        try {
            PutObjectArgs args = PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectName)
                    .stream(inputStream, inputStream.available(), -1)
                    .build();
            return minioClient.putObject(args);
        } catch (ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | IOException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 创建文件夹或目录
     *
     * @param bucketName 存储桶
     * @param objectName 目录路径
     */
    public ObjectWriteResponse putDirObject(String bucketName, String objectName) {
        PutObjectArgs args = PutObjectArgs.builder()
                .bucket(bucketName)
                .object(objectName)
                .stream(new ByteArrayInputStream(new byte[]{}), 0, -1)
                .build();
        try {
            return minioClient.putObject(args);
        } catch (ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | IOException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 获取全部 bucket
     */
    public List<Bucket> getAllBuckets() throws Exception {
        return minioClient.listBuckets();
    }

    /**
     * 根据 bucketName 删除信息
     *
     * @param bucketName 桶名
     */
    public void removeBucket(String bucketName) {
        try {
            minioClient.removeBucket(RemoveBucketArgs.builder().bucket(bucketName).build());
        } catch (ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | IOException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取⽂件外链
     *
     * @param bucketName bucket名称
     * @param objectName ⽂件名称
     * @param expires    过期时间 <=7
     */
    public String getObjectUrl(String bucketName, String objectName, Integer expires) {
        GetPresignedObjectUrlArgs args = GetPresignedObjectUrlArgs.builder()
                .method(Method.GET)
                .bucket(bucketName)
                .object(objectName)
                .expiry(expires)    // 单位：秒
                .build();

        try {
            return minioClient.getPresignedObjectUrl(args);
        } catch (ErrorResponseException | InsufficientDataException | InternalException | InvalidResponseException | InvalidKeyException | NoSuchAlgorithmException | IOException | XmlParserException | ServerException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 获取⽂件外链
     *
     * @param bucketName bucket名称
     * @param objectName ⽂件名称
     * @param duration 过期时间
     * @param unit  过期时间的单位
     */
    public String getObjectUrl(String bucketName, String objectName, int duration, TimeUnit unit) {
        GetPresignedObjectUrlArgs args = GetPresignedObjectUrlArgs.builder()
                .method(Method.GET)
                .bucket(bucketName)
                .object(objectName)
                .expiry(duration, unit)
                .build();

        try {
            return minioClient.getPresignedObjectUrl(args);
        } catch (ErrorResponseException | InsufficientDataException | InternalException | InvalidResponseException | InvalidKeyException | NoSuchAlgorithmException | IOException | XmlParserException | ServerException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 获取文件
     *
     * @param bucketName bucket名称
     * @param objectName ⽂件名称
     * @return ⼆进制流
     */
    public InputStream getObject(String bucketName, String objectName) throws Exception {
        GetObjectArgs args = GetObjectArgs.builder()
                .bucket(bucketName)
                .object(objectName)
                .build();
        return minioClient.getObject(args);
    }

    /**
     * 上传文件
     *
     * @param bucketName bucket名称
     * @param objectName ⽂件名称
     * @param stream     ⽂件流
     * @throws Exception https://docs.minio.io/cn/java-client-api-reference.html#putObject
     */
    public void putObject(String bucketName, String objectName, InputStream stream) {
        putObjectByStream(bucketName, objectName, stream);
    }

    /**
     * 文件流上传文件
     *
     * @param bucketName  bucket名称
     * @param objectName  ⽂件名称
     * @param stream      ⽂件流
     * @param size        ⼤⼩
     * @param contextType 类型
     */
    public void putObject(String bucketName, String objectName, InputStream stream, long size, String contextType) {
        putObjectByStream(bucketName, objectName, stream);
    }

    /**
     * 获取文件信息
     *
     * @param bucketName bucket名称
     * @param objectName ⽂件名称
     * @throws Exception https://docs.minio.io/cn/java-client-api-reference.html#statObject
     */
    public StatObjectResponse getObjectInfo(String bucketName, String objectName) {
        StatObjectArgs args = StatObjectArgs.builder()
                .bucket(bucketName)
                .object(objectName)
                .build();
        try {
            return minioClient.statObject(args);
        } catch (ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | IOException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 删除文件
     *
     * @param bucketName bucket名称
     * @param objectName ⽂件名称
     * @throws Exception https://docs.minio.io/cn/java-client-apireference.html#removeObject
     */
    public void removeObject(String bucketName, String objectName) {
        RemoveObjectArgs args = RemoveObjectArgs.builder()
                .bucket(bucketName)
                .object(objectName)
                .build();
        try {
            minioClient.removeObject(args);
        } catch (ErrorResponseException | InsufficientDataException | InternalException | InvalidKeyException | InvalidResponseException | IOException | NoSuchAlgorithmException | ServerException | XmlParserException e) {
            e.printStackTrace();
        }
    }
}
~~~
