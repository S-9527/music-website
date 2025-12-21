package com.example.yin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.yin.common.R;
import com.example.yin.model.domain.SongList;
import com.example.yin.model.request.SongListRequest;
import com.example.yin.service.SongListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class SongListController {

    @Autowired
    private SongListService songListService;


    // 添加歌单
    @PostMapping("/songList/add")
    public R addSongList(@RequestBody SongListRequest addSongListRequest) {
        return songListService.addSongList(addSongListRequest);
    }

    // 删除歌单
    @GetMapping("/songList/delete")
    public R deleteSongList(@RequestParam int id) {
        return songListService.deleteSongList(id);
    }

    // 返回所有歌单（支持分页，默认每页10条）
    @GetMapping("/songList")
    public R allSongList(@RequestParam(defaultValue = "1") Integer pageNum,
                         @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<SongList> page = new Page<>(pageNum, pageSize);
        return songListService.allSongList(page);
    }

    // 返回标题包含文字的歌单（支持分页，默认每页10条）
    @GetMapping("/songList/likeTitle/detail")
    public R songListOfLikeTitle(@RequestParam String title,
                                 @RequestParam(defaultValue = "1") Integer pageNum,
                                 @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<SongList> page = new Page<>(pageNum, pageSize);
        return songListService.likeTitle('%' + title + '%', page);
    }

    // 返回指定类型的歌单（支持分页，默认每页10条）
    @GetMapping("/songList/style/detail")
    public R songListOfStyle(@RequestParam String style,
                             @RequestParam(defaultValue = "1") Integer pageNum,
                             @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<SongList> page = new Page<>(pageNum, pageSize);
        return songListService.likeStyle('%' + style + '%', page);
    }

    // 更新歌单信息
    @PostMapping("/songList/update")
    public R updateSongListMsg(@RequestBody SongListRequest updateSongListRequest) {
        return songListService.updateSongListMsg(updateSongListRequest);

    }

    // 更新歌单图片
    @PostMapping("/songList/img/update")
    public R updateSongListPic(@RequestParam("file") MultipartFile avatorFile, @RequestParam("id") int id) {

        return songListService.updateSongListImg(avatorFile,id);
    }
}
